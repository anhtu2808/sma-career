import type { JobDetailData } from "@/lib/api";

const JOB_LEVEL_MAP: Record<string, string> = {
  INTERN: "Intern", FRESHER: "Fresher", JUNIOR: "Junior",
  MIDDLE: "Middle", SENIOR: "Senior", LEAD: "Lead", MANAGER: "Manager",
};

const WORKING_MODEL_MAP: Record<string, string> = {
  REMOTE: "Remote", ONSITE: "Onsite", HYBRID: "Hybrid",
};

export function formatSalary(start?: number, end?: number): string {
  if (start && end) {
    return `${new Intl.NumberFormat("vi-VN").format(start)} - ${new Intl.NumberFormat("vi-VN").format(end)} VND`;
  }
  return "Negotiable";
}

interface JobDetailMetaChipsProps {
  jobDetail: JobDetailData;
  primaryColor: string;
}

export default function JobDetailMetaChips({ jobDetail, primaryColor }: JobDetailMetaChipsProps) {
  return (
    <div style={{
      padding: "20px 32px", display: "flex", flexWrap: "wrap", gap: 12,
      borderBottom: "1px solid #f0f0f0", fontSize: 14, color: "#374151",
      background: "#fafafa"
    }}>
      {jobDetail.locations && jobDetail.locations.length > 0 && (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: primaryColor }}>📍</span>
          {jobDetail.locations.map(l => l.city || l.name).filter(Boolean).join(", ")}
        </span>
      )}
      {(jobDetail.salaryStart || jobDetail.salaryEnd) && (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: primaryColor }}>💰</span>
          <span style={{ fontWeight: 700, color: primaryColor }}>
            {formatSalary(jobDetail.salaryStart, jobDetail.salaryEnd)}
          </span>
        </span>
      )}
      {jobDetail.experienceTime !== undefined && jobDetail.experienceTime !== null && (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: primaryColor }}>⏱</span>
          {jobDetail.experienceTime} years exp
        </span>
      )}
      {jobDetail.jobLevel && (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: primaryColor }}>🎯</span>
          {JOB_LEVEL_MAP[jobDetail.jobLevel] || jobDetail.jobLevel}
        </span>
      )}
      {jobDetail.workingModel && (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: primaryColor }}>🏢</span>
          {WORKING_MODEL_MAP[jobDetail.workingModel] || jobDetail.workingModel}
        </span>
      )}
      {jobDetail.expDate && (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: primaryColor }}>📅</span>
          Deadline: {new Date(jobDetail.expDate).toLocaleDateString()}
        </span>
      )}
    </div>
  );
}
