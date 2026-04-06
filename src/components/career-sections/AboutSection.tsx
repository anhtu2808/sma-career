import type { FlatTheme, LayoutSectionSettings } from "@/types/career-page";

interface AboutSectionProps {
  theme: FlatTheme;
  sectionProps: Record<string, unknown>;
  settings: LayoutSectionSettings;
}

export default function AboutSection({ theme, sectionProps = {}, settings = {} }: AboutSectionProps) {
  const { primaryColor, backgroundColor, textColor, borderRadius, shadow } = theme;
  const {
    headline = 'Chúng tôi là ai?',
    description = 'We are a global technology company dedicated to solving complex problems with elegant solutions.',
    imageUrl,
  } = sectionProps as {
    headline?: string;
    description?: string;
    imageUrl?: string;
  };

  const shadowMap: Record<string, string> = {
    none: 'none',
    subtle: '0 2px 8px rgba(0,0,0,0.06)',
    medium: '0 4px 20px rgba(0,0,0,0.1)',
  };

  return (
    <section id="about-section" style={{
      background: settings.backgroundColorOverride || backgroundColor,
      padding: `${settings.paddingTop || 64}px 40px ${settings.paddingBottom || 64}px`,
      textAlign: (settings.textAlign as React.CSSProperties['textAlign']) || 'center',
    }}>
      <div style={{
        display: 'flex', gap: '40px', alignItems: 'center',
        maxWidth: '1280px', margin: '0 auto',
        flexDirection: imageUrl ? 'row' : 'column',
      }}>
        {imageUrl && (
          <div style={{
            width: '400px', flexShrink: 0,
            borderRadius: `${borderRadius}px`,
            overflow: 'hidden',
            boxShadow: shadowMap[shadow],
          }}>
            <div style={{
              height: '280px',
              background: `url(${imageUrl}) center/cover no-repeat`,
            }} />
          </div>
        )}

        <div style={{ textAlign: imageUrl ? 'left' : 'center', flex: 1 }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, color: textColor, marginBottom: '16px' }}>
            {headline}
          </h2>
          <div
            style={{
              fontSize: '15px', color: textColor, opacity: 0.65,
              lineHeight: 1.8, maxWidth: imageUrl ? 'none' : '600px',
              margin: imageUrl ? 0 : '0 auto',
            }}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </div>
    </section>
  );
}
