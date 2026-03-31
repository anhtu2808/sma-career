import type { FlatTheme, LayoutSectionSettings } from "@/types/career-page";

interface AwardItem {
  name: string;
  imgUrl?: string;
  year: string;
  isVisible?: boolean;
}

interface AwardsSectionProps {
  theme: FlatTheme;
  sectionProps: Record<string, unknown>;
  settings: LayoutSectionSettings;
}

export default function AwardsSection({ theme, sectionProps = {}, settings = {} }: AwardsSectionProps) {
  const { primaryColor, backgroundColor, textColor, borderRadius, shadow } = theme;
  const { headline = 'Giải thưởng danh giá' } = sectionProps as { headline?: string };

  const items: AwardItem[] = (sectionProps.items as AwardItem[]) || [
    { name: 'Best IT Company 2025', imgUrl: '', year: '2025' },
    { name: 'Top 10 AI Startups', imgUrl: '', year: '2024' },
    { name: 'Great Place to Work', imgUrl: '', year: '2024' },
  ];

  const shadowMap: Record<string, string> = {
    none: 'none', subtle: '0 2px 8px rgba(0,0,0,0.06)', medium: '0 4px 20px rgba(0,0,0,0.1)',
  };

  return (
    <section style={{
      background: settings.backgroundColorOverride || backgroundColor,
      padding: `${settings.paddingTop || 64}px 40px ${settings.paddingBottom || 64}px`,
      textAlign: (settings.textAlign as React.CSSProperties['textAlign']) || 'center',
    }}>
      <h2 style={{ fontSize: '32px', fontWeight: 700, color: textColor, marginBottom: '40px' }}>
        {headline}
      </h2>

      <div style={{
        display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap',
        maxWidth: '800px', margin: '0 auto',
      }}>
        {items.filter(item => item.isVisible !== false).map((item, i) => (
          <div key={i} style={{
            background: backgroundColor,
            borderRadius: `${borderRadius}px`,
            padding: '28px 24px',
            boxShadow: shadowMap[shadow],
            border: '1px solid rgba(0,0,0,0.06)',
            width: '200px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
            transition: 'transform 0.2s',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: `${borderRadius}px`,
              background: item.imgUrl ? `url(${item.imgUrl}) center/contain no-repeat` : `${primaryColor}10`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px',
            }}>
              {!item.imgUrl && '🏆'}
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: textColor, textAlign: 'center' }}>
              {item.name}
            </div>
            <div style={{
              fontSize: '12px', fontWeight: 600, color: primaryColor,
              background: `${primaryColor}10`, padding: '3px 10px', borderRadius: '20px',
            }}>
              {item.year}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
