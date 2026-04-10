import type { JobDetailData } from "@/lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faMoneyBillWave,
  faClock,
  faBullseye,
  faBuilding,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";

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
      borderBottom: "1px solid #f0f0f0", fontSize: '0.875rem', color: "#374151",
      background: "#fafafa"
    }}>
      {jobDetail.locations && jobDetail.locations.length > 0 && (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FontAwesomeIcon icon={faLocationDot} style={{ color: primaryColor, fontSize: '0.875rem' }} />
          {jobDetail.locations.map(l => l.city || l.name).filter(Boolean).join(", ")}
        </span>
      )}
      {(jobDetail.salaryStart || jobDetail.salaryEnd) && (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FontAwesomeIcon icon={faMoneyBillWave} style={{ color: primaryColor, fontSize: '0.875rem' }} />
          <span style={{ fontWeight: 700, color: primaryColor }}>
            {formatSalary(jobDetail.salaryStart, jobDetail.salaryEnd)}
          </span>
        </span>
      )}
      {jobDetail.experienceTime !== undefined && jobDetail.experienceTime !== null && (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FontAwesomeIcon icon={faClock} style={{ color: primaryColor, fontSize: '0.875rem' }} />
          {jobDetail.experienceTime} years exp
        </span>
      )}
      {jobDetail.jobLevel && (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FontAwesomeIcon icon={faBullseye} style={{ color: primaryColor, fontSize: '0.875rem' }} />
          {JOB_LEVEL_MAP[jobDetail.jobLevel] || jobDetail.jobLevel}
        </span>
      )}
      {jobDetail.workingModel && (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FontAwesomeIcon icon={faBuilding} style={{ color: primaryColor, fontSize: '0.875rem' }} />
          {WORKING_MODEL_MAP[jobDetail.workingModel] || jobDetail.workingModel}
        </span>
      )}
      {jobDetail.expDate && (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FontAwesomeIcon icon={faCalendarDays} style={{ color: primaryColor, fontSize: '0.875rem' }} />
          Deadline: {new Date(jobDetail.expDate).toLocaleDateString()}
        </span>
      )}
    </div>
  );
}
