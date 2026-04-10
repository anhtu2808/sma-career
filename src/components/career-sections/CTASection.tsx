import type { FlatTheme, LayoutSectionSettings } from "@/types/career-page";

interface CTASectionProps {
  theme: FlatTheme;
  sectionProps: Record<string, unknown>;
  settings: LayoutSectionSettings;
}

export default function CTASection({ theme, sectionProps = {}, settings = {} }: CTASectionProps) {
  const { primaryColor, secondaryColor, borderRadius, buttonStyle } = theme;
  const {
    headline = 'Sẵn sàng bứt phá sự nghiệp?',
    ctaText = 'Ứng tuyển ngay',
    ctaLink = '#',
  } = sectionProps as { headline?: string; ctaText?: string; ctaLink?: string };

  return (
    <section style={{
      background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}CC 100%)`,
      padding: `${settings.paddingTop || 64}px 40px ${settings.paddingBottom || 64}px`,
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -30, right: -30, width: 120, height: 120,
        borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
      }} />
      <div style={{
        position: 'absolute', bottom: -20, left: '20%', width: 80, height: 80,
        borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
          {headline}
        </h2>
        {ctaText && (
          <a href={ctaLink} style={{
            padding: '14px 36px',
            borderRadius: `${borderRadius}px`,
            background: secondaryColor || '#fff',
            color: primaryColor,
            border: 'none',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: buttonStyle === 'shadow' ? '0 8px 24px rgba(0,0,0,0.25)' : 'none',
            textDecoration: 'none',
            display: 'inline-block',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}>
            {ctaText}
          </a>
        )}
      </div>
    </section>
  );
}
