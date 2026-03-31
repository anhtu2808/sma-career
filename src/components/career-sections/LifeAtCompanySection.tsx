import type { FlatTheme, LayoutSectionSettings } from "@/types/career-page";

interface NewsItem {
  title: string;
  thumbnailUrl?: string;
  date: string;
  url?: string;
  isVisible?: boolean;
}

interface LifeAtCompanySectionProps {
  theme: FlatTheme;
  sectionProps: Record<string, unknown>;
  settings: LayoutSectionSettings;
}

export default function LifeAtCompanySection({ theme, sectionProps = {}, settings = {} }: LifeAtCompanySectionProps) {
  const { primaryColor, backgroundColor, textColor, borderRadius, shadow } = theme;
  const { headline = 'Đời sống tại công ty' } = sectionProps as { headline?: string };

  const news: NewsItem[] = (sectionProps.news as NewsItem[]) || [
    { title: 'Team Building 2025 tại Phú Quốc', thumbnailUrl: '', date: '15/03/2026' },
    { title: 'Workshop: Tương lai của Generative AI', thumbnailUrl: '', date: '10/03/2026' },
    { title: 'Hackathon nội bộ Q1/2026', thumbnailUrl: '', date: '01/02/2026' },
  ];

  const shadowMap: Record<string, string> = {
    none: 'none', subtle: '0 2px 8px rgba(0,0,0,0.06)', medium: '0 4px 20px rgba(0,0,0,0.1)',
  };

  const visibleNews = news.filter(item => item.isVisible !== false);

  return (
    <section id="life-section" style={{
      background: settings.backgroundColorOverride || `${primaryColor}05`,
      padding: `${settings.paddingTop || 64}px 40px ${settings.paddingBottom || 64}px`,
      textAlign: 'center',
    }}>
      <h2 style={{ fontSize: '32px', fontWeight: 700, color: textColor, marginBottom: '40px' }}>
        {headline}
      </h2>

      <div style={{
        display: 'grid', gridTemplateColumns: `repeat(${Math.min(visibleNews.length, 3)}, 1fr)`,
        gap: '20px', maxWidth: '800px', margin: '0 auto',
      }}>
        {visibleNews.map((item, i) => {
          const Tag = item.url ? "a" : "div";
          const linkProps = item.url ? { href: item.url, target: "_blank", rel: "noopener noreferrer" } : {};
          return (
            <Tag key={i} {...linkProps} style={{
              background: backgroundColor,
              borderRadius: `${borderRadius}px`,
              overflow: 'hidden',
              boxShadow: shadowMap[shadow],
              border: '1px solid rgba(0,0,0,0.06)',
              textAlign: 'left',
              transition: 'transform 0.2s',
              textDecoration: 'none',
              color: 'inherit',
              display: 'block'
            }}>
              <div style={{
                height: '160px',
                background: item.thumbnailUrl
                  ? `url(${item.thumbnailUrl}) center/cover no-repeat`
                  : `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}08)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '36px',
              }}>
                {!item.thumbnailUrl && '📸'}
              </div>
              <div style={{ padding: '16px 18px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: textColor, marginBottom: '6px' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '12px', color: textColor, opacity: 0.45 }}>
                  {item.date}
                </div>
              </div>
            </Tag>
          );
        })}
      </div>
    </section>
  );
}
