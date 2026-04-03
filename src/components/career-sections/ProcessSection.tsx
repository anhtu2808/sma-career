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
    }}>
      <h2 style={{ fontSize: '32px', fontWeight: 700, color: textColor, marginBottom: '48px' }}>
        {headline}
      </h2>

      <div style={{
        display: 'grid', gridTemplateColumns: `repeat(${Math.min(visibleSteps.length, 4)}, 1fr)`,
        gap: '32px', maxWidth: '1100px', margin: '0 auto', position: 'relative',
      }}>
        {visibleSteps.map((step, i) => (
          <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: primaryColor, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '18px', margin: '0 auto 20px',
            }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            {i < visibleSteps.length - 1 && (
              <div style={{
                position: 'absolute', top: 30, left: '60%', width: '80%',
                height: '2px', background: secondaryColor || `${primaryColor}30`,
              }} />
            )}
            <div style={{ fontSize: '17px', fontWeight: 700, color: textColor, marginBottom: '8px' }}>
              {step.title}
            </div>
            <div style={{ fontSize: '14px', color: textColor, opacity: 0.55, lineHeight: 1.6 }}>
              {step.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
