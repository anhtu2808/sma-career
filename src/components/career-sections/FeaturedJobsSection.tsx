"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Select, Slider, ConfigProvider, Modal, Form, Input, Upload, Button, message } from "antd";
import type { FlatTheme, LayoutSectionSettings } from "@/types/career-page";
import { fetchJobs, fetchSkills, fetchExpertises, fetchDomains, uploadFile, uploadPublicResume, publicApplyJob, fetchJobQuestions, type JobApiItem, type JobQuestion } from "@/lib/api";

interface FeaturedJobsSectionProps {
  theme: FlatTheme;
  sectionProps: Record<string, unknown>;
  settings: LayoutSectionSettings;
}

const ITEMS_PER_PAGE = 10;

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
  const [skillOptions, setSkillOptions] = useState<{label: string, value: number}[]>([]);
  const [expertiseOptions, setExpertiseOptions] = useState<{label: string, value: number}[]>([]);
  const [domainOptions, setDomainOptions] = useState<{label: string, value: number}[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // ─── Data state ──────────────────────────────────────────
  const [fetchedJobs, setFetchedJobs] = useState<JobApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ─── Modal State ─────────────────────────────────────────
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyingJob, setApplyingJob] = useState<JobApiItem | null>(null);
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobQuestions, setJobQuestions] = useState<JobQuestion[]>([]);
  const [isFetchingQuestions, setIsFetchingQuestions] = useState(false);

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
    fetchSkills().then(res => setSkillOptions(res.map(s => ({label: s.name, value: s.id}))));
    fetchExpertises().then(res => setExpertiseOptions(res.map(e => ({label: e.name, value: e.id}))));
    fetchDomains().then(res => setDomainOptions(res.map(d => ({label: d.name, value: d.id}))));
  }, [loadJobs]);

  // ─── Handlers ────────────────────────────────────────────
  const handleReset = () => {
    setSearchName(""); setSearchLocation("");
    setSelectedLevel(""); setSelectedModel("");
    setSalaryRange([0, 100]); setExperienceRange([0, 10]);
    setSelectedSkills([]); setSelectedExpertises([]); setSelectedDomains([]);
    setCurrentPage(1);
  };

  const handleApplyClick = async (job: JobApiItem) => {
    setApplyingJob(job);
    setApplyModalOpen(true);
    form.resetFields();
    setSelectedFile(null);
    setJobQuestions([]);
    setIsFetchingQuestions(true);
    const questions = await fetchJobQuestions(job.id);
    setJobQuestions(questions);
    setIsFetchingQuestions(false);
  };

  const handleModalClose = () => {
    if (isSubmitting) return;
    setApplyModalOpen(false);
    setApplyingJob(null);
  };

  const handleApplySubmit = async (values: any) => {
    if (!applyingJob) return;
    if (!selectedFile) {
      message.error("Please upload your CV.");
      return;
    }
    setIsSubmitting(true);
    try {
      // 1. Upload File
      const fileData = await uploadFile(selectedFile);
      if (!fileData || !fileData.downloadUrl) {
        throw new Error("Failed to upload CV. Could not retrieve URL.");
      }

      // 2. Register Resume
      const resumeId = await uploadPublicResume({
        resumeName: selectedFile.name,
        fileName: fileData.originalFileName || selectedFile.name,
        resumeUrl: fileData.downloadUrl,
      });

      // 3. Apply
      const answersList = jobQuestions.map((q) => ({
        questionId: q.id,
        answerContent: values[`question_${q.id}`] || "",
      }));

      await publicApplyJob({
        jobId: applyingJob.id,
        resumeId,
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        coverLetter: values.coverLetter || "",
        appliedAt: new Date().toISOString(),
        answers: answersList,
      });

      message.success("Application submitted successfully! Thank you for your interest.");
      setApplyModalOpen(false);
      form.resetFields();
      setSelectedFile(null);
    } catch (err: any) {
      message.error(err.message || "An error occurred while applying. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      const isAllowed = file.type === "application/pdf" || file.name.endsWith(".doc") || file.name.endsWith(".docx");
      if (!isAllowed) {
        message.error("Only PDF or DOC/DOCX files are supported!");
        return Upload.LIST_IGNORE;
      }
      setSelectedFile(file);
      return false; // Prevent default upload behavior
    },
    onRemove: () => {
      setSelectedFile(null);
    },
    maxCount: 1,
  };

  // ─── Styles ──────────────────────────────────────────────
  const shadowMap: Record<string, string> = {
    none: "none", subtle: "0 2px 8px rgba(0,0,0,0.06)", medium: "0 4px 20px rgba(0,0,0,0.1)",
  };

  const btnBase: React.CSSProperties = {
    padding: "10px 24px", borderRadius: `${borderRadius}px`,
    fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
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
    border: "1px solid #d9d9d9", fontSize: "14px", outline: "none",
    color: textColor, background: "#fff", boxSizing: "border-box", transition: "all 0.2s"
  };
  const labelStyle: React.CSSProperties = { fontSize: "14px", fontWeight: 700, color: textColor, marginBottom: "8px", display: "block" };
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
    }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <h2 style={{ fontSize: "32px", fontWeight: 700, color: textColor, marginBottom: "8px" }}>{headline}</h2>
      </div>

      <div style={{ display: "flex", gap: "28px", maxWidth: "960px", margin: "0 auto", alignItems: "flex-start" }}>
        {/* ─── Filter Sidebar ──────────────────────────────────── */}
        <div style={{
          width: "280px", flexShrink: 0,
          background: "#fff", borderRadius: `${borderRadius}px`,
          border: "1px solid #f0f0f0", boxShadow: shadowMap[shadow],
          padding: "24px 20px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: primaryColor, fontSize: "16px" }}>▼</span>
              <span style={{ fontSize: "18px", fontWeight: 800, color: textColor }}>Filters</span>
            </div>
            <button onClick={handleReset} style={{
              background: "none", border: "none", color: primaryColor,
              fontSize: "13px", fontWeight: 600, cursor: "pointer",
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
              <span style={{ fontSize: "12px", fontWeight: "normal", color: "#64748b", marginLeft: "8px" }}>
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
              <span style={{ fontSize: "12px", fontWeight: "normal", color: "#64748b", marginLeft: "8px" }}>
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
          <div style={{ fontSize: "13px", color: textColor, opacity: 0.5, marginBottom: "14px" }}>
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
                  transition: "box-shadow 0.2s, transform 0.2s",
                }}>
                  {/* Company logo */}
                  <div style={{
                    width: 48, height: 48, borderRadius: `${borderRadius}px`,
                    background: job.company?.logo
                      ? `url(${job.company.logo}) center/contain no-repeat`
                      : `${primaryColor}10`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, fontSize: "18px", color: primaryColor,
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}>
                    {!job.company?.logo && ""}
                  </div>

                  {/* Job details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "15px", fontWeight: 700, color: textColor }}>
                        {job.name}
                      </span>
                      {job.isHighlight && (
                        <span style={{
                          padding: "1px 8px", borderRadius: "4px", fontSize: "10px",
                          fontWeight: 700, background: "#FEF2F2", color: "#EF4444",
                          border: "1px solid #FECACA",
                        }}>🔥 HOT</span>
                      )}
                    </div>

                    {job.company?.name && (
                      <div style={{ fontSize: "13px", color: textColor, opacity: 0.6, marginBottom: "6px" }}>
                        {job.company.name}
                      </div>
                    )}

                    <div style={{ fontSize: "12px", color: textColor, opacity: 0.5, marginBottom: "8px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
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
                          padding: "2px 10px", borderRadius: "4px", fontSize: "11px",
                          fontWeight: 500, background: `${primaryColor}08`, color: primaryColor,
                          border: `1px solid ${primaryColor}20`,
                        }}>{skill.name}</span>
                      ))}
                    </div>

                    {job.uploadTime && (
                      <div style={{ fontSize: "11px", color: textColor, opacity: 0.35, marginTop: "8px" }}>
                        Posted {new Date(job.uploadTime).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Salary */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: primaryColor, whiteSpace: "nowrap" }}>
                      {formatSalary(job.salaryStart, job.salaryEnd)}
                    </div>
                    <button
                      onClick={() => handleApplyClick(job)}
                      style={{
                        ...(btnStyles[buttonStyle] || btnStyles.flat),
                        marginTop: "8px", padding: "6px 16px", fontSize: "12px",
                      }}
                    >Apply Now</button>
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: "center", padding: "48px 20px", color: textColor, opacity: 0.4, fontSize: "14px" }}>
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
                  fontSize: "14px", color: textColor, display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}
              >‹</button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)} style={{
                  width: 32, height: 32, borderRadius: `${borderRadius}px`,
                  border: page === currentPage ? "none" : "1px solid #e5e7eb",
                  background: page === currentPage ? primaryColor : "#fff",
                  color: page === currentPage ? "#fff" : textColor,
                  fontSize: "13px", fontWeight: 600, cursor: "pointer",
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
                  fontSize: "14px", color: textColor, display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}
              >›</button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* ─── Application Modal ────────────────────────────────────── */}
      <Modal
        title={`Apply for: ${applyingJob?.name || ""}`}
        open={applyModalOpen}
        onCancel={handleModalClose}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleApplySubmit} style={{ marginTop: 16 }}>
          <Form.Item name="fullName" label="Full Name" rules={[{ required: true, message: "Please enter your full name" }]}>
            <Input placeholder="John Doe" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Invalid email address" }
          ]}>
            <Input placeholder="email@example.com" />
          </Form.Item>
          <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: "Please enter your phone number" }]}>
            <Input placeholder="09xxxx..." />
          </Form.Item>
          <Form.Item name="coverLetter" label="Cover Letter">
            <Input.TextArea placeholder="Briefly introduce yourself or your career goals..." rows={4} />
          </Form.Item>

          {/* ─── Tải bộ câu hỏi từ API ───────────────────────────── */}
          {isFetchingQuestions ? (
             <div style={{ padding: "16px 0", textAlign: "center", color: "#6b7280", fontSize: 13 }}>Loading job questions...</div>
          ) : (
             jobQuestions.map((q) => (
                <Form.Item 
                  key={q.id} 
                  name={`question_${q.id}`} 
                  label={q.content} 
                  rules={[{ required: q.isRequired, message: "Please answer this question" }]}
                >
                  <Input.TextArea placeholder="Answer question..." rows={3} />
                </Form.Item>
             ))
          )}

          {/* ─── UI Mới cho Phần Upload CV ──────────────────────── */}
          <style>{`.custom-upload .ant-upload-select { width: 100% !important; display: block !important; }`}</style>
          <Form.Item label="Resume (CV)" required style={{ marginTop: 20 }}>
            <Upload {...uploadProps} showUploadList={false} className="custom-upload" style={{ width: "100%", display: "block" }}>
              {!selectedFile ? (
                <div style={{
                  width: "100%", padding: "18px 24px", border: "1px dashed #cbd5e1",
                  borderRadius: "10px", background: "#f8fafc", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 10, color: "#334155", transition: "all 0.2s"
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = primaryColor)}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
                >
                  <span style={{ fontSize: 18, color: "#64748b" }}>↑</span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Upload CV (PDF, DOC)</span>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {/* Upload New CV Button */}
                  <div style={{
                    width: "100%", padding: "14px 20px", border: "1px dashed #cbd5e1",
                    borderRadius: "10px", background: "#f8fafc", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 8, color: "#334155", transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.borderColor = primaryColor)}
                  onMouseOut={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
                  >
                    <span style={{ fontSize: 16, color: "#64748b" }}>↑</span>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>Upload another CV (PDF, DOC)</span>
                  </div>

                  {/* Selected CV Card */}
                  <div style={{
                    width: "100%", padding: "14px 20px", border: "1px solid #f97316",
                    background: "#fff7ed", borderRadius: "10px", display: "flex",
                    alignItems: "center", justifyContent: "space-between", cursor: "default",
                    transition: "all 0.2s"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#1f2937", marginBottom: 2, wordBreak: "break-all" }}>
                          {selectedFile.name}
                        </div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>
                          {new Date().toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                    </div>
                    <div style={{ 
                      width: 24, height: 24, borderRadius: "50%", border: "2px solid #f97316",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#f97316", fontSize: 12, fontWeight: 700, flexShrink: 0
                     }}>
                      ✓
                    </div>
                  </div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24 }}>
            <Button onClick={handleModalClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting} style={{ background: primaryColor }}>
              Submit Application
            </Button>
          </div>
        </Form>
      </Modal>

    </section>
    </ConfigProvider>
  );
}
