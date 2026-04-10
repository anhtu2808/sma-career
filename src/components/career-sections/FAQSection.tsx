"use client";

import { useState } from "react";
import type { FlatTheme, LayoutSectionSettings } from "@/types/career-page";

interface FAQItem {
  question: string;
  answer: string;
  isVisible?: boolean;
}

interface FAQSectionProps {
  theme: FlatTheme;
  sectionProps: Record<string, unknown>;
  settings: LayoutSectionSettings;
}

export default function FAQSection({ theme, sectionProps = {}, settings = {} }: FAQSectionProps) {
  const { primaryColor, secondaryColor, backgroundColor, textColor, borderRadius } = theme;
  const { headline = 'Câu hỏi thường gặp' } = sectionProps as { headline?: string };
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items: FAQItem[] = (sectionProps.items as FAQItem[]) || [
    { question: 'Công ty có hỗ trợ thực tập sinh không?', answer: 'Có, chúng tôi luôn chào đón các bạn sinh viên tài năng.' },
    { question: 'Thời gian làm việc như thế nào?', answer: 'Từ thứ 2 đến thứ 6, 8:30 - 17:30.' },
    { question: 'Có hỗ trợ làm việc remote không?', answer: 'Có, nhân viên được làm việc tại nhà 2 ngày/tuần theo chính sách Hybrid Work.' },
  ];

  return (
    <section style={{
      background: settings.backgroundColorOverride || backgroundColor,
      padding: `${settings.paddingTop || 64}px 40px ${settings.paddingBottom || 64}px`,
      textAlign: 'center',
    }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, color: textColor, marginBottom: '40px' }}>
        {headline}
      </h2>

      <div style={{ maxWidth: '1080px', margin: '0 auto', textAlign: 'left' }}>
        {items.filter(item => item.isVisible !== false).map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              style={{
                borderRadius: `${borderRadius}px`,
                border: '1px solid rgba(0,0,0,0.08)',
                marginBottom: '10px',
                overflow: 'hidden',
                background: '#fff',
              }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                style={{
                  width: '100%', padding: '16px 20px',
                  background: isOpen ? (secondaryColor || `${primaryColor}08`) : 'transparent',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: textColor }}>
                  {item.question}
                </span>
                <span style={{
                  fontSize: '1.125rem', color: primaryColor, fontWeight: 700,
                  transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                  flexShrink: 0, marginLeft: '12px',
                }}>
                  +
                </span>
              </button>
              {isOpen && (
                <div style={{
                  padding: '0 20px 16px',
                  fontSize: '0.8125rem', color: textColor, opacity: 0.65, lineHeight: 1.7,
                }}>
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
