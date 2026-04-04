import type { JobDetailData } from "@/lib/api";

interface JobDetailContentProps {
  jobDetail: JobDetailData;
  textColor: string;
  primaryColor: string;
  borderRadius: number;
}

export default function JobDetailContent({ jobDetail, textColor, primaryColor, borderRadius }: JobDetailContentProps) {
  return (
    <div style={{ padding: "32px" }}>
      {/* About */}
      {jobDetail.about && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{
            fontSize: 18, fontWeight: 800, color: textColor, marginBottom: 12,
            paddingBottom: 10, borderBottom: `2px solid ${primaryColor}15`,
          }}>About the Role</h3>
          <div
            style={{ fontSize: 15, color: "#374151", lineHeight: 1.8 }}
            dangerouslySetInnerHTML={{ __html: jobDetail.about }}
          />
        </div>
      )}

      {/* Responsibilities */}
      {jobDetail.responsibilities && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{
            fontSize: 18, fontWeight: 800, color: textColor, marginBottom: 12,
            paddingBottom: 10, borderBottom: `2px solid ${primaryColor}15`,
          }}>Responsibilities</h3>
          <div
            style={{ fontSize: 15, color: "#374151", lineHeight: 1.8 }}
            dangerouslySetInnerHTML={{ __html: jobDetail.responsibilities }}
          />
        </div>
      )}

      {/* Requirements */}
      {jobDetail.requirement && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{
            fontSize: 18, fontWeight: 800, color: textColor, marginBottom: 12,
            paddingBottom: 10, borderBottom: `2px solid ${primaryColor}15`,
          }}>Requirements</h3>
          <div
            style={{ fontSize: 15, color: "#374151", lineHeight: 1.8 }}
            dangerouslySetInnerHTML={{ __html: jobDetail.requirement }}
          />
        </div>
      )}

      {/* Benefits */}
      {jobDetail.benefits && jobDetail.benefits.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{
            fontSize: 18, fontWeight: 800, color: textColor, marginBottom: 16,
            paddingBottom: 10, borderBottom: `2px solid ${primaryColor}15`,
          }}>What We Can Offer</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {jobDetail.benefits.map(b => (
              <div key={b.id} style={{
                padding: "16px 20px", borderRadius: `${borderRadius}px`,
                border: "1px solid #f0f0f0", background: "#fff",
                display: "flex", alignItems: "center", gap: 16,
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: `${primaryColor}12`, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 20, color: primaryColor, flexShrink: 0,
                }}>
                  {b.type === "FINANCIAL" ? "💵" : b.type === "HEALTH" ? "🏥" : b.type === "EDUCATION" ? "📚" : "✨"}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: textColor }}>{b.name}</div>
                  {b.description && (
                    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{b.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Location details */}
      {jobDetail.locations && jobDetail.locations.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3 style={{
            fontSize: 18, fontWeight: 800, color: textColor, marginBottom: 16,
            paddingBottom: 10, borderBottom: `2px solid ${primaryColor}15`,
          }}>Office Locations</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {jobDetail.locations.map(loc => (
              <div key={loc.id} style={{
                padding: "16px 20px", borderRadius: `${borderRadius}px`,
                border: "1px solid #f0f0f0", background: "#FAFAFA",
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: textColor }}>{loc.name || loc.city}</div>
                {loc.address && (
                  <div style={{ fontSize: 14, color: "#6b7280", marginTop: 6 }}>
                    {[loc.address, loc.district, loc.city, loc.country].filter(Boolean).join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
