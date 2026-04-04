"use client";

import type { FlatTheme, FooterConfig } from "@/types/career-page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { resolveIcon } from "@/utils/icons";

interface FooterSectionProps {
  theme: FlatTheme;
  footerConfig: FooterConfig;
}

export default function FooterSection({ theme, footerConfig }: FooterSectionProps) {
  const { primaryColor } = theme;
  const {
    companyName = 'SmartRecruit',
    contact = {},
    socialLinks = [],
    copyrightText = '© 2026 SmartRecruit. All rights reserved.',
  } = footerConfig;

  const defaultSocials = socialLinks.length > 0 ? socialLinks : [
    { platform: 'LinkedIn', url: '#' },
    { platform: 'Facebook', url: '#' },
    { platform: 'GitHub', url: '#' },
  ];

  return (
    <footer style={{ background: '#1a1a2e', padding: '48px 40px', color: '#fff' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        gap: '40px', maxWidth: '960px', margin: '0 auto',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: '260px', maxWidth: '400px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: primaryColor, display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '12px',
            }}>SR</div>
            <span style={{ fontWeight: 700, fontSize: '15px' }}>{companyName}</span>
          </div>
          {contact?.email && (
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginBottom: '8px' }}>
              ✉ {contact.email}
            </p>
          )}
          {contact?.phone && (
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginBottom: '8px' }}>
              ☎ {contact.phone}
            </p>
          )}
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            {defaultSocials.map((s, i) => {
              const iconKey = (s.icon || s.platform).toLowerCase();
              const SOCIAL_ICON_COLORS: Record<string, string> = {
                facebook: '#1877F2',
                twitter: '#1DA1F2',
                linkedin: '#0A66C2',
                instagram: '#E4405F',
                youtube: '#FF0000',
                github: '#fff',
                tiktok: '#fff',
                pinterest: '#E60023',
                discord: '#5865F2',
                telegram: '#26A5E4',
                whatsapp: '#25D366',
                threads: '#fff',
              };
              const iconColor = SOCIAL_ICON_COLORS[iconKey] || 'rgba(255,255,255,0.5)';
              return (
                <a
                  key={s.platform || i}
                  href={s.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: iconColor,
                    fontSize: '15px',
                    transition: 'background 0.2s, transform 0.2s',
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <FontAwesomeIcon icon={resolveIcon(iconKey)} />
                </a>
              );
            })}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '260px', maxWidth: '400px', textAlign: 'right' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>Hệ thống cơ sở</div>
          {contact?.addresses && contact.addresses.map((addr, i) => (
            <p key={`addr-${i}`} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '10px' }}>
              {addr}
            </p>
          ))}
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        marginTop: '36px', paddingTop: '20px',
        textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.3)',
      }}>
        {copyrightText}
      </div>
    </footer>
  );
}
