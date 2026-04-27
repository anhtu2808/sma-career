"use client";

import { useState } from "react";
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
  const { primaryColor, backgroundColor, textColor, borderRadius } = theme;
  const { headline = 'Tại sao bạn nên gia nhập?' } = sectionProps as { headline?: string };

  const items: EVPItem[] = (sectionProps.items as EVPItem[]) || [
    { title: 'Lương thưởng cạnh tranh', desc: 'Lương tháng 13 + thưởng hiệu quả dự án định kỳ.', icon: 'payments' },
    { title: 'Môi trường Hybrid', desc: 'Làm việc linh hoạt 2 ngày tại nhà mỗi tuần.', icon: 'apartment' },
    { title: 'Lộ trình thăng tiến', desc: 'Review lương 2 lần/năm với lộ trình rõ ràng.', icon: 'trending_up' },
    { title: 'Sức khỏe toàn diện', desc: 'Bảo hiểm sức khỏe cao cấp cho cả gia đình.', icon: 'security' },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Use background color override if set, otherwise fallback to global background
  const sectionBg = (settings.backgroundColorOverride as string) || backgroundColor;

  return (
    <section
      id="evp-section"
      style={{
        background: sectionBg,
        padding: `${(settings.paddingTop as number || 140)}px 40px ${(settings.paddingBottom as number || 140)}px`,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        clipPath: 'inset(0)' // Essential for the 'stationary' background effect
      }}
    >
      {/* STATIONARY BACKGROUND PATTERN (Parallax) */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, width: '100vw', height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: settings.patternColorOverride ? 0.15 : 0.08,
        color: (settings.patternColorOverride as string) || primaryColor,
        display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center'
      }}>
        <div style={{ fontSize: '250px', transform: 'rotate(-15deg)', margin: '50px' }}><FontAwesomeIcon icon={resolveIcon('payments')} /></div>
        <div style={{ fontSize: '180px', transform: 'rotate(20deg)', margin: '50px' }}><FontAwesomeIcon icon={resolveIcon('security')} /></div>
        <div style={{ fontSize: '300px', transform: 'rotate(-5deg)', margin: '50px' }}><FontAwesomeIcon icon={resolveIcon('trending_up')} /></div>
        <div style={{ fontSize: '200px', transform: 'rotate(10deg)', margin: '50px' }}><FontAwesomeIcon icon={resolveIcon('redeem')} /></div>
        <div style={{ fontSize: '150px', transform: 'rotate(-25deg)', margin: '50px' }}><FontAwesomeIcon icon={resolveIcon('groups')} /></div>
        <div style={{ fontSize: '280px', transform: 'rotate(15deg)', margin: '50px' }}><FontAwesomeIcon icon={resolveIcon('apartment')} /></div>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '64px' }}>
          <h2 style={{
            fontSize: `${40 * ((theme.baseFontSize || 16) / 16)}px`,
            fontWeight: 800,
            color: (settings.textColorOverride as string) || textColor,
            margin: 0,
            lineHeight: 1.25,
            letterSpacing: '-1px'
          }}>
            {headline}
          </h2>
        </div>

        <div className="career-container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '32px',
          margin: '0 auto',
          maxWidth: '1440px'
        }}>
          {items.filter(b => b.isVisible !== false).map((b, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                background: '#FFFFFF',
                borderRadius: `${borderRadius}px`,
                padding: '32px 24px',
                textAlign: 'center',
                boxShadow: hoveredIndex === i ? '0 30px 60px rgba(0,0,0,0.2)' : '0 10px 25px rgba(0,0,0,0.1)',
                border: 'none',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.5s ease',
                transform: hoveredIndex === i ? 'translateY(-15px)' : 'translateY(0)',
                cursor: 'default',
              }}
            >
              <div style={{
                fontSize: '40px',
                color: primaryColor,
                width: '80px', height: '80px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${primaryColor}10`,
                borderRadius: `${borderRadius === 0 ? 0 : Math.max(4, borderRadius - 4)}px`,
                margin: '0 auto 20px',
                transition: 'all 0.4s ease',
                transform: hoveredIndex === i ? 'scale(1.1) rotate(10deg)' : 'scale(1)'
              }}>
                <FontAwesomeIcon icon={resolveIcon(b.icon)} />
              </div>

              <div style={{
                fontSize: `${20 * ((theme.baseFontSize || 16) / 16)}px`,
                fontWeight: 800,
                color: '#1a1a1a',
                marginBottom: '12px',
                lineHeight: 1.3
              }}>
                {b.title}
              </div>
              <div style={{
                fontSize: `${15 * ((theme.baseFontSize || 16) / 16)}px`,
                color: '#666',
                lineHeight: 1.6
              }}>
                {b.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
