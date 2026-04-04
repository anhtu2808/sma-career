import type { JobDetailData } from "@/lib/api";

interface JobDetailSkillTagsProps {
  jobDetail: JobDetailData;
  primaryColor: string;
}

export default function JobDetailSkillTags({ jobDetail, primaryColor }: JobDetailSkillTagsProps) {
  if (!jobDetail.skills?.length && !jobDetail.expertise?.name && !jobDetail.domains?.length) {
    return null;
  }

  return (
    <div style={{ padding: "20px 32px", borderBottom: "1px solid #f0f0f0" }}>
      {jobDetail.skills && jobDetail.skills.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#6b7280", marginRight: 10 }}>Skills:</span>
          {jobDetail.skills.map(s => (
            <span key={s.id} style={{
              display: "inline-block", padding: "4px 14px", borderRadius: 6, fontSize: 13,
              fontWeight: 500, background: `${primaryColor}08`, color: primaryColor,
              border: `1px solid ${primaryColor}20`, marginRight: 8, marginBottom: 6,
            }}>{s.name}</span>
          ))}
        </div>
      )}
      {jobDetail.expertise?.name && (
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#6b7280", marginRight: 10 }}>Job Expertise:</span>
          <span style={{
            display: "inline-block", padding: "4px 14px", borderRadius: 6, fontSize: 13,
            fontWeight: 600, background: "#EFF6FF", color: "#2563EB",
            border: "1px solid #BFDBFE",
          }}>{jobDetail.expertise.name}</span>
        </div>
      )}
      {jobDetail.domains && jobDetail.domains.length > 0 && (
        <div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#6b7280", marginRight: 10 }}>Job Domain:</span>
          {jobDetail.domains.map(d => (
            <span key={d.id} style={{
              display: "inline-block", padding: "4px 14px", borderRadius: 6, fontSize: 13,
              fontWeight: 600, background: "#F0FDF4", color: "#16A34A",
              border: "1px solid #BBF7D0", marginRight: 8,
            }}>{d.name}</span>
          ))}
        </div>
      )}
    </div>
  );
}
