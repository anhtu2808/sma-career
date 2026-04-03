"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { resolveIcon } from "@/utils/icons";
import type { FlatTheme, LayoutSectionSettings } from "@/types/career-page";

interface EVPItem {
  title: string;
  desc: string;
  icon?: string;
  isVisible?: boolean;
}

interface EVPSectionProps {
  theme: FlatTheme;
  sectionProps: Record<string, unknown>;
  settings: LayoutSectionSettings;
}

export default function EVPSection({ theme, sectionProps = {}, settings = {} }: EVPSectionProps) {
  const { primaryColor, secondaryColor, backgroundColor, textColor, borderRadius, shadow } = theme;
  const { headline = 'Tại sao bạn nên gia nhập?' } = sectionProps as { headline?: string };

  const items: EVPItem[] = (sectionProps.items as EVPItem[]) || [
    { title: 'Lương thưởng cạnh tranh', desc: 'Lương tháng 13 + thưởng hiệu quả dự án định kỳ.', icon: 'payments' },
    { title: 'Môi trường Hybrid', desc: 'Làm việc linh hoạt 2 ngày tại nhà mỗi tuần.', icon: 'apartment' },
    { title: 'Lộ trình thăng tiến', desc: 'Review lương 2 lần/năm với lộ trình rõ ràng.', icon: 'trending_up' },
    { title: 'Sức khỏe toàn diện', desc: 'Bảo hiểm sức khỏe cao cấp cho cả gia đình.', icon: 'security' },
  ];

  const shadowMap: Record<string, string> = {
    none: 'none',
    subtle: '0 2px 8px rgba(0,0,0,0.06)',
    medium: '0 4px 20px rgba(0,0,0,0.1)',
  };

  return (
    <section id="evp-section" style={{
      background: settings.backgroundColorOverride || `${primaryColor}06`,
      padding: `${settings.paddingTop || 64}px 40px ${settings.paddingBottom || 64}px`,
      textAlign: 'center',
    }}>
      <h2 style={{ fontSize: '32px', fontWeight: 700, color: textColor, marginBottom: '40px' }}>
        {headline}
      </h2>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px',
        maxWidth: '1100px', margin: '0 auto',
      }}>
        {items.filter(b => b.isVisible !== false).map((b, i) => (
          <div key={i} style={{
            background: '#fff',
            borderRadius: `${borderRadius}px`,
            padding: '36px 32px',
            textAlign: 'left',
            boxShadow: shadowMap[shadow],
            border: '1px solid rgba(0,0,0,0.06)',
            position: 'relative',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{
                fontSize: '28px',
                color: primaryColor,
                width: '52px', height: '52px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: secondaryColor || `${primaryColor}15`,
                borderRadius: '8px',
              }}>
                <FontAwesomeIcon icon={resolveIcon(b.icon)} />
              </div>
            </div>

            <div style={{ fontSize: '18px', fontWeight: 700, color: textColor, marginBottom: '8px' }}>
              {b.title}
            </div>
            <div style={{ fontSize: '14px', color: textColor, opacity: 0.6, lineHeight: 1.7 }}>
              {b.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
