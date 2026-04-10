import type { JobDetailData } from "@/lib/api";

interface JobDetailHeaderProps {
  jobDetail: JobDetailData;
  textColor: string;
}

export default function JobDetailHeader({ jobDetail, textColor }: JobDetailHeaderProps) {
  return (
    <div style={{
      padding: "32px 32px 24px", borderBottom: "1px solid #f0f0f0",
      display: "flex", alignItems: "flex-start", gap: 20,
    }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: textColor, margin: 0, lineHeight: 1.3 }}>
          {jobDetail.name}
        </h1>
        <div style={{ fontSize: '0.9375rem', color: "#6b7280", marginTop: 8 }}>
          {jobDetail.company?.name || "Company"}
          {jobDetail.uploadTime && (
            <span style={{ marginLeft: 8, fontSize: '0.8125rem', opacity: 0.8 }}>
              · Posted {new Date(jobDetail.uploadTime).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
