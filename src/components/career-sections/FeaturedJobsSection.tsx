"use client";
import { useState, useCallback, useMemo, useEffect } from "react";

import { useParams, useRouter } from "next/navigation";
import { Select, Slider, ConfigProvider } from "antd";
import type { FlatTheme, LayoutSectionSettings } from "@/types/career-page";
import { fetchJobs, fetchSkills, fetchExpertises, fetchDomains, type JobApiItem } from "@/lib/api";
import { buildPath } from "@/utils/navigation";
import ApplyJobModal from "./ApplyJobModal";

interface FeaturedJobsSectionProps {
  theme: FlatTheme;
  sectionProps: Record<string, unknown>;
  settings: LayoutSectionSettings;
}

const ITEMS_PER_PAGE = 5;

const JOB_LEVEL_MAP: Record<string, string> = {
  INTERN: "Intern", FRESHER: "Fresher", JUNIOR: "Junior",
  MIDDLE: "Middle", SENIOR: "Senior", LEAD: "Lead", MANAGER: "Manager",
};
const WORKING_MODEL_MAP: Record<string, string> = {
  REMOTE: "Remote", ONSITE: "Onsite", HYBRID: "Hybrid",
};

function formatSalary(start?: number, end?: number): string {
  if (start && end) {
    return `${new Intl.NumberFormat("vi-VN").format(start)} - ${new Intl.NumberFormat("vi-VN").format(end)} VND`;
  }
  return "Negotiable";
}

function formatLocation(job: JobApiItem): string {
  if (job.locations && job.locations.length > 0) {
    return job.locations.map((l) => l.city || l.name).filter(Boolean).join(", ");
  }
  return job.company?.country || "";
}

export default function FeaturedJobsSection({ theme, sectionProps = {}, settings = {} }: FeaturedJobsSectionProps) {
  const { primaryColor, backgroundColor, textColor, borderRadius, buttonStyle, shadow } = theme;
  const { headline = "Các vị trí đang tuyển dụng", companyId } = sectionProps as {
    headline?: string;
    companyId?: number;
  };

  // ─── Filter state ────────────────────────────────────────
  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 100]);
  const [experienceRange, setExperienceRange] = useState<[number, number]>([0, 10]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [selectedExpertises, setSelectedExpertises] = useState<number[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<number[]>([]);
  const [skillOptions, setSkillOptions] = useState<{ label: string, value: number }[]>([]);
  const [expertiseOptions, setExpertiseOptions] = useState<{ label: string, value: number }[]>([]);
  const [domainOptions, setDomainOptions] = useState<{ label: string, value: number }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // ─── Data state ──────────────────────────────────────────
  const [fetchedJobs, setFetchedJobs] = useState<JobApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const params = useParams();

  // ─── Modal State ─────────────────────────────────────────
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyingJob, setApplyingJob] = useState<JobApiItem | null>(null);

  // ─── Fetch jobs from API ─────────────────────────────────
  const loadJobs = useCallback(async () => {
    if (!companyId) return;
    setIsLoading(true);
    try {
      const result = await fetchJobs({
        companyId,
        status: "PUBLISHED",
        page: 0,
        size: 100,
      });
      if (result) {
        setFetchedJobs(result.content || []);
      }
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  const jobLevelOptions = Object.entries(JOB_LEVEL_MAP).map(([k, v]) => ({ label: v, value: k }));
  const workingModelOptions = Object.entries(WORKING_MODEL_MAP).map(([k, v]) => ({ label: v, value: k }));

  // ─── Filter Logic ────────────────────────────────────────
  const filteredJobs = useMemo(() => {
    let list = [...fetchedJobs];

    if (searchName) {
      list = list.filter((j) => j.name?.toLowerCase().includes(searchName.toLowerCase()));
    }
    if (searchLocation) {
      list = list.filter((j) => {
        const locStr = formatLocation(j).toLowerCase();
        return locStr.includes(searchLocation.toLowerCase());
      });
    }
    if (selectedLevel) {
      list = list.filter((j) => j.jobLevel === selectedLevel);
    }
    if (selectedModel) {
      list = list.filter((j) => j.workingModel === selectedModel);
    }
    if (salaryRange[0] > 0 || salaryRange[1] < 100) {
      const minSalary = salaryRange[0] * 1000000;
      const maxSalary = salaryRange[1] * 1000000;
      list = list.filter((j) => {
        const js = j.salaryStart || 0;
        const je = j.salaryEnd || 0;
        // If the job has no salary specified, it might be excluded unless both range are default
        if (salaryRange[1] === 100) return js >= minSalary;
        return js >= minSalary && je <= maxSalary;
      });
    }
    if (experienceRange[0] > 0 || experienceRange[1] < 10) {
      list = list.filter((j) => {
        const exp = j.experienceTime || 0;
        if (experienceRange[1] === 10) return exp >= experienceRange[0];
        return exp >= experienceRange[0] && exp <= experienceRange[1];
      });
    }
    if (selectedSkills.length > 0) {
      list = list.filter((j) => {
        const jobSkillIds = j.skills?.map((s) => s.id) || [];
        return selectedSkills.some((sId) => jobSkillIds.includes(sId));
      });
    }
    if (selectedExpertises.length > 0) {
      list = list.filter((j) => {
        const expId = j.expertise?.id;
        return expId && selectedExpertises.includes(expId);
      });
    }
    if (selectedDomains.length > 0) {
      list = list.filter((j) => {
        const jobDomainIds = j.domains?.map((d) => d.id) || [];
        return selectedDomains.some((dId) => jobDomainIds.includes(dId));
      });
    }

    return list;
  }, [fetchedJobs, searchName, searchLocation, selectedLevel, selectedModel, salaryRange, experienceRange, selectedSkills, selectedExpertises, selectedDomains]);

  const totalElements = filteredJobs.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / ITEMS_PER_PAGE));
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    loadJobs();
    fetchSkills().then(res => setSkillOptions(res.map(s => ({ label: s.name, value: s.id }))));
    fetchExpertises().then(res => setExpertiseOptions(res.map(e => ({ label: e.name, value: e.id }))));
    fetchDomains().then(res => setDomainOptions(res.map(d => ({ label: d.name, value: d.id }))));
  }, [loadJobs]);

  // ─── Handlers ────────────────────────────────────────────
  const handleReset = () => {
    setSearchName(""); setSearchLocation("");
    setSelectedLevel(""); setSelectedModel("");
    setSalaryRange([0, 100]); setExperienceRange([0, 10]);
    setSelectedSkills([]); setSelectedExpertises([]); setSelectedDomains([]);
    setCurrentPage(1);
  };

  const handleApplyClick = (job: JobApiItem) => {
    setApplyingJob(job);
    setApplyModalOpen(true);
  };

  const handleViewDetail = (job: JobApiItem) => {
    const slug = params.slug as string;
    router.push(buildPath(slug, `/jobs/${job.id}`));
  };

  const handleModalClose = () => {
    setApplyModalOpen(false);
    setApplyingJob(null);
  };

  // ─── Styles ──────────────────────────────────────────────
  const shadowMap: Record<string, string> = {
    none: "none", subtle: "0 2px 8px rgba(0,0,0,0.06)", medium: "0 4px 20px rgba(0,0,0,0.1)",
  };

  const btnBase: React.CSSProperties = {
    padding: "10px 24px", borderRadius: `${borderRadius}px`,
    fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
    textDecoration: "none", display: "inline-block", border: "none",
  };
  const btnStyles: Record<string, React.CSSProperties> = {
    flat: { ...btnBase, background: primaryColor, color: "#fff" },
    outline: { ...btnBase, background: "transparent", color: primaryColor, border: `2px solid ${primaryColor}` },
    shadow: { ...btnBase, background: primaryColor, color: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" },
    ghost: { ...btnBase, background: `${primaryColor}10`, color: primaryColor },
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 14px", borderRadius: `${borderRadius}px`,
    border: "1px solid #d9d9d9", fontSize: "0.875rem", outline: "none",
    color: textColor, background: "#fff", boxSizing: "border-box", transition: "all 0.2s"
  };
  const labelStyle: React.CSSProperties = { fontSize: "0.875rem", fontWeight: 700, color: textColor, marginBottom: "8px", display: "block" };
  const fieldGap: React.CSSProperties = { marginBottom: "24px" };

  return (
    <ConfigProvider theme={{
      token: {
        colorPrimary: primaryColor,
        borderRadius: borderRadius,
        fontFamily: theme.fontFamily,
      }
    }}>
      <section id="jobs-section" style={{
        background: settings.backgroundColorOverride || backgroundColor,
        padding: `${settings.paddingTop || 64}px 40px ${settings.paddingBottom || 64}px`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Scattered IT background icons */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          {/* Code brackets — top left */}
          <svg style={{ position: 'absolute', top: '5%', left: '5%', opacity: 0.15, transform: 'rotate(-12deg)' }} width="90" height="90" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
          </svg>
          {/* Monitor/Desktop — top center-left */}
          <svg style={{ position: 'absolute', top: '3%', left: '30%', opacity: 0.12, transform: 'rotate(8deg)' }} width="85" height="85" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          {/* Cloud — top center-right */}
          <svg style={{ position: 'absolute', top: '6%', left: '58%', opacity: 0.15, transform: 'rotate(-5deg)' }} width="80" height="80" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
          </svg>
          {/* Briefcase — top right */}
          <svg style={{ position: 'absolute', top: '4%', right: '8%', opacity: 0.15, transform: 'rotate(15deg)' }} width="80" height="80" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          {/* CPU/Chip — left middle-top */}
          <svg style={{ position: 'absolute', top: '28%', left: '3%', opacity: 0.12, transform: 'rotate(20deg)' }} width="95" height="95" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
          </svg>
          {/* Database — right middle-top */}
          <svg style={{ position: 'absolute', top: '25%', right: '5%', opacity: 0.15, transform: 'rotate(-10deg)' }} width="80" height="80" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          </svg>
          {/* Wifi/Network — center left */}
          <svg style={{ position: 'absolute', top: '50%', left: '8%', opacity: 0.12, transform: 'rotate(5deg)' }} width="75" height="75" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
          {/* Magnifying Glass — center */}
          <svg style={{ position: 'absolute', top: '42%', left: '35%', opacity: 0.1, transform: 'rotate(-18deg)' }} width="100" height="100" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          {/* Terminal — center right */}
          <svg style={{ position: 'absolute', top: '48%', right: '12%', opacity: 0.12, transform: 'rotate(6deg)' }} width="85" height="85" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
          </svg>
          {/* Laptop — bottom left */}
          <svg style={{ position: 'absolute', bottom: '12%', left: '6%', opacity: 0.15, transform: 'rotate(-7deg)' }} width="90" height="90" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="12" rx="2" /><line x1="2" y1="20" x2="22" y2="20" />
          </svg>
          {/* Git Branch — bottom center-left */}
          <svg style={{ position: 'absolute', bottom: '8%', left: '28%', opacity: 0.12, transform: 'rotate(12deg)' }} width="75" height="75" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" />
          </svg>
          {/* Globe/Internet — bottom center */}
          <svg style={{ position: 'absolute', bottom: '5%', left: '50%', opacity: 0.12, transform: 'rotate(-10deg)' }} width="80" height="80" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          {/* Shield/Security — bottom right */}
          <svg style={{ position: 'absolute', bottom: '10%', right: '8%', opacity: 0.15, transform: 'rotate(8deg)' }} width="85" height="85" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          {/* Settings/Gear — right middle-bottom */}
          <svg style={{ position: 'absolute', bottom: '30%', right: '3%', opacity: 0.12, transform: 'rotate(-15deg)' }} width="80" height="80" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          {/* Lightbulb — left bottom */}
          <svg style={{ position: 'absolute', bottom: '35%', left: '2%', opacity: 0.12, transform: 'rotate(22deg)' }} width="75" height="75" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
          </svg>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: (settings.textColorOverride as string) || textColor, marginBottom: "8px" }}>{headline}</h2>
          </div>

          <div className="career-container" style={{ display: "flex", gap: "28px", margin: "0 auto", alignItems: "flex-start" }}>
            {/* ─── Filter Sidebar ──────────────────────────────────── */}
            <div style={{
              width: "280px", flexShrink: 0,
              background: "#fff", borderRadius: `${borderRadius}px`,
              border: "1px solid #f0f0f0", boxShadow: shadowMap[shadow],
              padding: "24px 20px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: primaryColor, fontSize: "1rem" }}>▼</span>
                  <span style={{ fontSize: "1.125rem", fontWeight: 800, color: textColor }}>Filters</span>
                </div>
                <button onClick={handleReset} style={{
                  background: "none", border: "none", color: primaryColor,
                  fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer",
                }}>Reset</button>
              </div>

              {/* Location */}
              <div style={fieldGap}>
                <label style={labelStyle}>Location</label>
                <input style={inputStyle} placeholder="Enter Location" value={searchLocation}
                  onChange={(e) => { setSearchLocation(e.target.value); setCurrentPage(1); }} />
              </div>

              {/* Job Level */}
              <div style={fieldGap}>
                <label style={labelStyle}>Job Level</label>
                <Select
                  showSearch
                  allowClear
                  options={jobLevelOptions}
                  value={selectedLevel || undefined}
                  onChange={(val) => { setSelectedLevel(val ?? ""); setCurrentPage(1); }}
                  placeholder="Select Job Level"
                  style={{ width: "100%" }}
                  filterOption={(input, option) => (option?.label as string ?? '').toLowerCase().includes(input.toLowerCase())}
                />
              </div>

              {/* Working Model */}
              <div style={fieldGap}>
                <label style={labelStyle}>Working Model</label>
                <Select
                  showSearch
                  allowClear
                  options={workingModelOptions}
                  value={selectedModel || undefined}
                  onChange={(val) => { setSelectedModel(val ?? ""); setCurrentPage(1); }}
                  placeholder="Select Working Model"
                  style={{ width: "100%" }}
                  filterOption={(input, option) => (option?.label as string ?? '').toLowerCase().includes(input.toLowerCase())}
                />
              </div>

              {/* Skills */}
              <div style={fieldGap}>
                <label style={labelStyle}>Skills</label>
                <Select
                  mode="multiple"
                  showSearch
                  allowClear
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    (option?.label ?? "").toString().toLowerCase().includes(input.toLowerCase())
                  }
                  options={skillOptions}
                  value={selectedSkills}
                  onChange={(val) => { setSelectedSkills(val); setCurrentPage(1); }}
                  placeholder="Select skills..."
                  style={{ width: "100%" }}
                />
              </div>

              {/* Salary Range */}
              <div style={fieldGap}>
                <label style={labelStyle}>
                  Salary Range (VND)
                  <span style={{ fontSize: "0.75rem", fontWeight: "normal", color: "#64748b", marginLeft: "8px" }}>
                    {`${salaryRange[0] === 0 ? "0" : `${salaryRange[0]}M`} - ${salaryRange[1] === 100 ? "100M+" : `${salaryRange[1]}M`}`}
                  </span>
                </label>
                <Slider
                  range
                  min={0}
                  max={100}
                  step={5}
                  value={salaryRange}
                  onChange={(val) => { setSalaryRange(val as [number, number]); setCurrentPage(1); }}
                  tooltip={{ formatter: (v) => `${v}M VND` }}
                />
              </div>

              {/* Experience */}
              <div style={fieldGap}>
                <label style={labelStyle}>
                  Experience (Years)
                  <span style={{ fontSize: "0.75rem", fontWeight: "normal", color: "#64748b", marginLeft: "8px" }}>
                    {experienceRange[0]} - {experienceRange[1] === 10 ? "10+" : experienceRange[1]} years
                  </span>
                </label>
                <Slider
                  range
                  min={0}
                  max={10}
                  step={1}
                  value={experienceRange}
                  onChange={(val) => { setExperienceRange(val as [number, number]); setCurrentPage(1); }}
                  tooltip={{ formatter: (v) => `${v} yr` }}
                />
              </div>

              {/* Expertise */}
              <div style={fieldGap}>
                <label style={labelStyle}>Expertise</label>
                <Select
                  mode="multiple"
                  showSearch
                  allowClear
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    (option?.label ?? "").toString().toLowerCase().includes(input.toLowerCase())
                  }
                  options={expertiseOptions}
                  value={selectedExpertises}
                  onChange={(val) => { setSelectedExpertises(val); setCurrentPage(1); }}
                  placeholder="Select expertises..."
                  style={{ width: "100%" }}
                />
              </div>

              {/* Domain */}
              <div style={{ marginBottom: 0 }}>
                <label style={labelStyle}>Domain</label>
                <Select
                  mode="multiple"
                  showSearch
                  allowClear
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    (option?.label ?? "").toString().toLowerCase().includes(input.toLowerCase())
                  }
                  options={domainOptions}
                  value={selectedDomains}
                  onChange={(val) => { setSelectedDomains(val); setCurrentPage(1); }}
                  placeholder="Select domains..."
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            {/* ─── Job Listings ────────────────────────────────────── */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Search bar */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder="Search by job title..."
                  value={searchName}
                  onChange={(e) => { setSearchName(e.target.value); setCurrentPage(1); }}
                />
              </div>

              {/* Results count */}
              <div style={{ fontSize: "0.8125rem", color: textColor, opacity: 0.5, marginBottom: "14px" }}>
                {isLoading ? "Loading..." : `Showing ${paginatedJobs.length} / ${totalElements} jobs`}
              </div>

              {/* Loading state */}
              {isLoading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} style={{
                      background: "#fff", borderRadius: `${borderRadius}px`,
                      padding: "20px 24px", boxShadow: shadowMap[shadow],
                      border: "1px solid rgba(0,0,0,0.06)", height: "120px",
                      animation: "pulse 1.5s ease-in-out infinite",
                    }}>
                      <div style={{ width: "60%", height: 16, borderRadius: 4, background: "#f3f4f6", marginBottom: 10 }} />
                      <div style={{ width: "40%", height: 12, borderRadius: 4, background: "#f3f4f6", marginBottom: 10 }} />
                      <div style={{ width: "80%", height: 12, borderRadius: 4, background: "#f3f4f6" }} />
                    </div>
                  ))}
                </div>
              ) : (
                /* Job cards */
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {paginatedJobs.length > 0 ? paginatedJobs.map((job) => (
                    <div key={job.id} style={{
                      background: "#fff", borderRadius: `${borderRadius}px`,
                      padding: "20px 24px", display: "flex", alignItems: "flex-start",
                      gap: "16px", boxShadow: shadowMap[shadow],
                      border: "1px solid rgba(0,0,0,0.06)", textAlign: "left",
                    }}>
                      {/* Job details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                          <a
                            onClick={() => handleViewDetail(job)}
                            style={{ fontSize: "0.9375rem", fontWeight: 700, color: textColor, cursor: "pointer", textDecoration: "none" }}
                          >
                            {job.name}
                          </a>
                          {job.isHighlight && (
                            <span style={{
                              padding: "1px 8px", borderRadius: `${borderRadius}px`, fontSize: "0.625rem",
                              fontWeight: 700, background: "#FEF2F2", color: "#EF4444",
                              border: "1px solid #FECACA",
                            }}>🔥 HOT</span>
                          )}
                        </div>

                        {job.company?.name && (
                          <div style={{ fontSize: "0.8125rem", color: textColor, opacity: 0.6, marginBottom: "6px" }}>
                            {job.company.name}
                          </div>
                        )}

                        <div style={{ fontSize: "0.75rem", color: textColor, opacity: 0.5, marginBottom: "8px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                          {formatLocation(job) && <span>{formatLocation(job)}</span>}
                          {job.experienceTime !== undefined && job.experienceTime !== null && (
                            <span>{job.experienceTime} years</span>
                          )}
                          {job.workingModel && <span>{WORKING_MODEL_MAP[job.workingModel] || job.workingModel}</span>}
                          {job.jobLevel && <span>{JOB_LEVEL_MAP[job.jobLevel] || job.jobLevel}</span>}
                        </div>

                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          {job.skills?.map((skill) => (
                            <span key={skill.name} style={{
                              padding: "2px 10px", borderRadius: `${borderRadius}px`, fontSize: "0.6875rem",
                              fontWeight: 500, background: `${primaryColor}08`, color: primaryColor,
                              border: `1px solid ${primaryColor}20`,
                            }}>{skill.name}</span>
                          ))}
                        </div>

                        {job.uploadTime && (
                          <div style={{ fontSize: "0.6875rem", color: textColor, opacity: 0.35, marginTop: "8px" }}>
                            Posted {new Date(job.uploadTime).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      {/* Salary */}
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: "0.875rem", fontWeight: 700, color: primaryColor, whiteSpace: "nowrap" }}>
                          {formatSalary(job.salaryStart, job.salaryEnd)}
                        </div>
                        <button
                          onClick={() => handleViewDetail(job)}
                          style={{
                            marginTop: "8px", padding: "6px 16px", fontSize: "0.75rem",
                            borderRadius: `${borderRadius}px`, fontWeight: 600,
                            cursor: "pointer", transition: "all 0.2s",
                            background: "transparent", color: primaryColor,
                            border: `1.5px solid ${primaryColor}`, display: "block",
                            width: "140px", marginLeft: "auto", textAlign: "center",
                          }}
                        >View Detail</button>
                        <button
                          onClick={() => handleApplyClick(job)}
                          style={{
                            ...(btnStyles[buttonStyle] || btnStyles.flat),
                            marginTop: "6px", padding: "6px 16px", fontSize: "0.75rem",
                            display: "block", width: "140px", marginLeft: "auto", textAlign: "center",
                          }}
                        >Apply Now</button>
                      </div>
                    </div>
                  )) : (
                    <div style={{ textAlign: "center", padding: "48px 20px", color: textColor, opacity: 0.4, fontSize: "0.875rem" }}>
                      No matching jobs found.
                    </div>
                  )}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", marginTop: "24px" }}>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{
                      width: 32, height: 32, borderRadius: `${borderRadius}px`,
                      border: "1px solid #e5e7eb", background: "#fff",
                      cursor: currentPage === 1 ? "default" : "pointer",
                      opacity: currentPage === 1 ? 0.3 : 1,
                      fontSize: "0.875rem", color: textColor, display: "flex",
                      alignItems: "center", justifyContent: "center",
                    }}
                  >‹</button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button key={page} onClick={() => setCurrentPage(page)} style={{
                      width: 32, height: 32, borderRadius: `${borderRadius}px`,
                      border: page === currentPage ? "none" : "1px solid #e5e7eb",
                      background: page === currentPage ? primaryColor : "#fff",
                      color: page === currentPage ? "#fff" : textColor,
                      fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{page}</button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      width: 32, height: 32, borderRadius: `${borderRadius}px`,
                      border: "1px solid #e5e7eb", background: "#fff",
                      cursor: currentPage === totalPages ? "default" : "pointer",
                      opacity: currentPage === totalPages ? 0.3 : 1,
                      fontSize: "0.875rem", color: textColor, display: "flex",
                      alignItems: "center", justifyContent: "center",
                    }}
                  >›</button>
                </div>
              )}
            </div>
          </div>

        </div>

        <ApplyJobModal
          isOpen={applyModalOpen}
          onClose={handleModalClose}
          job={applyingJob}
          primaryColor={primaryColor}
          borderRadius={borderRadius}
        />

      </section>
    </ConfigProvider>
  );
}
