import type { FlatTheme, LayoutSectionSettings } from "@/types/career-page";

interface HeroSectionProps {
  theme: FlatTheme;
  sectionProps: Record<string, unknown>;
  settings: LayoutSectionSettings;
}

export default function HeroSection({ theme, sectionProps = {}, settings = {} }: HeroSectionProps) {
  const { primaryColor, borderRadius, buttonStyle } = theme;
  const {
    headline = 'Build the Future With Us',
    subline = 'Join a team of passionate innovators shaping the next generation of technology.',
    ctaText = 'Khám phá ngay',
    ctaLink = '#',
    backgroundUrl,
    mediaType,
  } = sectionProps as {
    headline?: string;
    subline?: string;
    ctaText?: string;
    ctaLink?: string;
    backgroundUrl?: string;
    mediaType?: string;
  };

  const pad = `${settings.paddingTop || 120}px 40px ${settings.paddingBottom || 120}px`;

  const btnBase: React.CSSProperties = {
    padding: '14px 32px',
    borderRadius: `${borderRadius}px`,
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    textDecoration: 'none',
    display: 'inline-block',
  };

  const isVideoUrl = (url?: string) => {
    if (!url) return false;
    return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url.toLowerCase());
  };
  const isVideo = mediaType === 'VIDEO' || isVideoUrl(backgroundUrl);

  let bgStyle: React.CSSProperties = {};
  if (backgroundUrl && !isVideo) {
    bgStyle = { backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${backgroundUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  } else if (!backgroundUrl && settings.backgroundColorOverride && settings.backgroundColorOverride.trim() !== '') {
    bgStyle = { background: settings.backgroundColorOverride };
  } else if (!backgroundUrl) {
    bgStyle = { background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}DD 50%, ${primaryColor}99 100%)` };
  } else if (isVideo) {
    bgStyle = { backgroundColor: '#000' }
  }

  return (
    <section style={{
      ...bgStyle,
      padding: pad,
      textAlign: (settings.textAlign as React.CSSProperties['textAlign']) || 'center',
      position: 'relative',
      overflow: 'hidden',
      minHeight: settings.height ? `${settings.height}px` : undefined,
      display: settings.height ? 'flex' : 'block',
      flexDirection: settings.height ? 'column' : undefined,
      justifyContent: settings.height ? 'center' : undefined,
    }}>
      {backgroundUrl && isVideo && (
        <>
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
            }}
          >
            <source src={backgroundUrl} />
          </video>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 0,
          }} />
        </>
      )}

      <div style={{
        position: 'absolute', top: -60, right: -60, width: 200, height: 200,
        borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', bottom: -40, left: '10%', width: 150, height: 150,
        borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
        zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 50px)', fontWeight: 800, color: settings.textColorOverride || '#fff',
          lineHeight: 1.2, marginBottom: '20px', letterSpacing: '-0.5px', whiteSpace: 'nowrap',
        }}>
          {headline}
        </h1>

        <p style={{
          fontSize: '18px', color: settings.textColorOverride || 'rgba(255,255,255,0.85)',
          maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.7,
          opacity: 0.8,
        }}>
          {subline}
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
          <a href={ctaLink as string} style={{
            ...btnBase,
            background: buttonStyle === 'ghost' ? 'transparent' : '#fff',
            color: primaryColor,
            border: buttonStyle === 'outline' ? '2px solid #fff' : 'none',
            boxShadow: buttonStyle === 'shadow' ? '0 8px 24px rgba(0,0,0,0.25)' : 'none',
          }}>
            {ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}
