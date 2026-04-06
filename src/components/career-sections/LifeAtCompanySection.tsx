import type { FlatTheme, LayoutSectionSettings } from "@/types/career-page";

interface NewsItem {
  title: string;
  thumbnailUrl?: string;
  date: string;
  url?: string;
  isVisible?: boolean;
}

interface NavLinkItem {
  url?: string;
  text?: string;
  isVisible?: boolean;
}

interface LifeAtCompanySectionProps {
  theme: FlatTheme;
  sectionProps: Record<string, unknown>;
  settings: LayoutSectionSettings;
}

export default function LifeAtCompanySection({ theme, sectionProps = {}, settings = {} }: LifeAtCompanySectionProps) {
  const { primaryColor, secondaryColor, textColor, borderRadius, shadow } = theme;
  const { headline = 'Đời sống tại công ty', navLink = {} } = sectionProps as {
    headline?: string;
    navLink?: NavLinkItem;
  };

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
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        maxWidth: '1280px', margin: '0 auto 40px',
      }}>
        <h2 style={{ fontSize: '32px', fontWeight: 700, color: textColor, margin: 0 }}>
          {headline}
        </h2>
        {navLink.isVisible !== false && navLink.text && (
          <a
            href={navLink.url || '#'}
            target={navLink.url?.startsWith('http') ? '_blank' : '_self'}
            rel="noopener noreferrer"
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: primaryColor,
              textDecoration: 'none',
              borderBottom: `1.5px solid ${primaryColor}`,
              paddingBottom: '2px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              transition: 'opacity 0.2s',
            }}
          >
            {navLink.text} <span style={{ fontSize: '16px' }}>→</span>
          </a>
        )}
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: `repeat(${Math.min(visibleNews.length, 3)}, 1fr)`,
        gap: '28px', maxWidth: '1280px', margin: '0 auto',
      }}>
        {visibleNews.map((item, i) => {
          const cardContent = (
            <div style={{
              background: '#fff',
              borderRadius: `${borderRadius}px`,
              overflow: 'hidden',
              boxShadow: shadowMap[shadow],
              border: '1px solid rgba(0,0,0,0.06)',
              textAlign: 'left',
              height: '100%',
              cursor: item.url ? 'pointer' : 'default',
            }}>
              <div style={{
                height: '200px',
                background: item.thumbnailUrl
                  ? `url(${item.thumbnailUrl}) center/cover no-repeat`
                  : secondaryColor || `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}08)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '36px',
              }}>
              </div>
              <div style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color: textColor, marginBottom: '8px' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '13px', color: textColor, opacity: 0.45 }}>
                  {item.date}
                </div>
              </div>
            </div>
          );

          return item.url ? (
            <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
              {cardContent}
            </a>
          ) : (
            <div key={i} style={{ height: '100%' }}>
              {cardContent}
            </div>
          );
        })}
      </div>
    </section>
  );
}
