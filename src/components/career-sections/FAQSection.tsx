"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { resolveIcon } from "@/utils/icons";
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const items: FAQItem[] = (sectionProps.items as FAQItem[]) || [
    { question: 'Công ty có hỗ trợ thực tập sinh không?', answer: 'Có, chúng tôi luôn chào đón các bạn sinh viên tài năng và tạo điều kiện để các bạn thực chiến trong các dự án thực tế với sự hướng dẫn của chuyên gia.' },
    { question: 'Thời gian làm việc như thế nào?', answer: 'Thời gian làm việc linh hoạt từ Thứ 2 đến Thứ 6 (8:30 - 17:30). Chúng tôi ưu tiên kết quả công việc hơn là việc kiểm soát thời gian chặt chẽ.' },
    { question: 'Có hỗ trợ làm việc remote không?', answer: 'Có, chúng tôi áp dụng chính sách Hybrid Work hiện đại, cho phép nhân viên làm việc tại nhà 2 ngày mỗi tuần để tối ưu sự cân bằng cuộc sống.' },
    { question: 'Quy trình phỏng vấn gồm mấy vòng?', answer: 'Thông thường gồm 3 vòng: Sơ loại hồ sơ, Phỏng vấn kỹ thuật/chuyên môn và Phỏng vấn văn hóa với Ban giám đốc.' },
  ];

  return (
    <section style={{
      background: settings.backgroundColorOverride || backgroundColor,
      padding: `${(settings.paddingTop as number || 100)}px 20px ${(settings.paddingBottom as number || 100)}px`,
      position: 'relative',
    }}>
      <div className="career-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 800, 
            color: (settings.textColorOverride as string) || textColor, 
            margin: '0 0 16px',
            letterSpacing: '-1px'
          }}>
            {headline}
          </h2>
          <div style={{ 
            width: '60px', 
            height: '4px', 
            background: primaryColor, 
            margin: '0 auto',
            borderRadius: '2px'
          }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {items.filter(item => item.isVisible !== false).map((item, i) => {
            const isOpen = openIndex === i;
            const isHovered = hoveredIndex === i;
            
            return (
              <div
                key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  borderRadius: '20px',
                  background: '#fff',
                  boxShadow: isOpen ? '0 20px 40px rgba(0,0,0,0.08)' : (isHovered ? '0 10px 30px rgba(0,0,0,0.06)' : '0 4px 12px rgba(0,0,0,0.03)'),
                  border: `1px solid ${isOpen ? primaryColor + '20' : 'rgba(0,0,0,0.05)'}`,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  style={{
                    width: '100%', 
                    padding: '24px 32px',
                    background: 'transparent',
                    border: 'none', 
                    cursor: 'pointer',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ 
                      width: '36px', height: '36px', 
                      borderRadius: '10px', 
                      background: isOpen ? primaryColor : (isHovered ? primaryColor + '15' : 'rgba(0,0,0,0.04)'),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isOpen ? '#fff' : (isHovered ? primaryColor : 'rgba(0,0,0,0.4)'),
                      transition: 'all 0.3s ease',
                      flexShrink: 0
                    }}>
                      <FontAwesomeIcon icon={resolveIcon('quiz')} style={{ fontSize: '1.2rem' }} />
                    </div>
                    <span style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 700, 
                      color: isOpen ? primaryColor : ((settings.textColorOverride as string) || textColor),
                      transition: 'color 0.3s ease'
                    }}>
                      {item.question}
                    </span>
                  </div>
                  <div style={{
                    width: '32px', height: '32px',
                    borderRadius: '50%',
                    background: isOpen ? primaryColor + '10' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isOpen ? primaryColor : 'rgba(0,0,0,0.3)',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    flexShrink: 0
                  }}>
                    <FontAwesomeIcon icon={resolveIcon('expand_more')} />
                  </div>
                </button>
                
                {/* SMOOTH EXPANSION CONTAINER */}
                <div style={{
                  maxHeight: isOpen ? '500px' : '0',
                  opacity: isOpen ? 1 : 0,
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    padding: '0 32px 32px 88px',
                    fontSize: '1rem', 
                    color: (settings.textColorOverride as string) || textColor, 
                    opacity: 0.8, 
                    lineHeight: 1.8,
                  }}>
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
