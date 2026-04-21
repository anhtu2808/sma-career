import type { FlatTheme, LayoutSectionSettings } from "@/types/career-page";

interface StepItem {
  title: string;
  desc: string;
  isVisible?: boolean;
}

interface ProcessSectionProps {
  theme: FlatTheme;
  sectionProps: Record<string, unknown>;
  settings: LayoutSectionSettings;
}

export default function ProcessSection({ theme, sectionProps = {}, settings = {} }: ProcessSectionProps) {
  const { primaryColor, secondaryColor, textColor } = theme;
  const { headline = 'Quy trình ứng tuyển' } = sectionProps as { headline?: string };

  const steps: StepItem[] = (sectionProps.steps as StepItem[]) || [
    { title: 'Nộp đơn', desc: 'Gửi CV qua nút ứng tuyển trên trang.' },
    { title: 'Phỏng vấn', desc: 'Trò chuyện cùng HR và Team kỹ thuật.' },
    { title: 'Nhận Offer', desc: 'Chào mừng bạn về với đội của chúng tôi!' },
  ];

  const visibleSteps = steps.filter(s => s.isVisible !== false);

  return (
    <section style={{
      background: settings.backgroundColorOverride || `${primaryColor}05`,
      padding: `${settings.paddingTop || 64}px 40px ${settings.paddingBottom || 64}px`,
      textAlign: (settings.textAlign as React.CSSProperties['textAlign']) || 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Bold Wave Left Pattern */}
      <div style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 0 }}>
        <svg width="250" height="600" viewBox="0 0 250 600" fill="none">
          <path d="M-40,-50 Q250,300 -40,650" stroke={primaryColor} strokeWidth="50" strokeLinecap="round" opacity="0.15" />
          <path d="M-40,80 Q160,300 -40,520" stroke={secondaryColor || primaryColor} strokeWidth="40" strokeLinecap="round" opacity="0.6" />
          <path d="M-40,210 Q90,300 -40,390" stroke={primaryColor} strokeWidth="30" strokeLinecap="round" opacity="1" />
        </svg>
      </div>

      {/* Bold Wave Right Pattern */}
      <div style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 0 }}>
        <svg width="250" height="600" viewBox="0 0 250 600" fill="none">
          <path d="M290,-50 Q0,300 290,650" stroke={primaryColor} strokeWidth="50" strokeLinecap="round" opacity="0.15" />
          <path d="M290,80 Q90,300 290,520" stroke={secondaryColor || primaryColor} strokeWidth="40" strokeLinecap="round" opacity="0.6" />
          <path d="M290,210 Q160,300 290,390" stroke={primaryColor} strokeWidth="30" strokeLinecap="round" opacity="1" />
        </svg>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: (settings.textColorOverride as string) || textColor, marginBottom: '48px' }}>
          {headline}
        </h2>

        <div className="career-container" style={{
          display: 'grid', gridTemplateColumns: `repeat(${Math.min(visibleSteps.length, 4)}, 1fr)`,
          gap: '32px', margin: '0 auto', position: 'relative',
        }}>
          {visibleSteps.map((step, i) => (
            <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: primaryColor, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '1.125rem', margin: '0 auto 20px',
                boxShadow: `0 4px 12px ${primaryColor}40`,
                position: 'relative', zIndex: 2
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              {i < visibleSteps.length - 1 && (
                <div style={{
                  position: 'absolute', top: 30, left: '60%', width: '80%',
                  height: '2px', background: secondaryColor || `${primaryColor}30`,
                }} />
              )}
              <div style={{ fontSize: '1.0625rem', fontWeight: 700, color: (settings.textColorOverride as string) || textColor, marginBottom: '8px' }}>
                {step.title}
              </div>
              <div style={{ fontSize: '0.875rem', color: (settings.textColorOverride as string) || textColor, opacity: 0.55, lineHeight: 1.6 }}>
                {step.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
