import type { FlatTheme, HeaderConfig } from "@/types/career-page";
import { buildPath } from "@/utils/navigation";

interface HeaderSectionProps {
  theme: FlatTheme;
  headerConfig: HeaderConfig;
  companyName?: string;
  slug?: string;
}

export default function HeaderSection({ theme, headerConfig, companyName = 'Company', slug }: HeaderSectionProps) {
  const { primaryColor, backgroundColor, textColor, borderRadius, buttonStyle } = theme;
  const {
    logoUrl,
    logoHeight = 40,
    navLinks = [],
    ctaButton = {},
  } = headerConfig;

  const defaultNavLinks = navLinks.length > 0 ? navLinks : [
    { label: 'Về chúng tôi' },
    { label: 'Công việc' },
    { label: 'Phúc lợi' },
    { label: 'Blog' },
  ];

  /** Build the correct href for a nav link.
   *  - On the career page itself (no slug prop), use simple anchors: #sectionId
   *  - On sub-pages like Job Detail (slug provided), use full path: /slug#sectionId
   */
  const buildNavHref = (targetSectionId?: string) => {
    if (!targetSectionId) return slug ? buildPath(slug) : '#';
    return slug ? buildPath(slug, '', targetSectionId) : `#${targetSectionId}`;
  };

  const btnBase: React.CSSProperties = {
    padding: '8px 20px',
    borderRadius: `${borderRadius}px`,
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const btnStyles: Record<string, React.CSSProperties> = {
    filled: { ...btnBase, background: primaryColor, color: '#fff', border: 'none' },
    flat: { ...btnBase, background: primaryColor, color: '#fff', border: 'none' },
    outline: { ...btnBase, background: 'transparent', color: primaryColor, border: `2px solid ${primaryColor}` },
    shadow: { ...btnBase, background: primaryColor, color: '#fff', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' },
    ghost: { ...btnBase, background: 'transparent', color: primaryColor, border: 'none' },
  };

  return (
    <header style={{
      background: '#fff',
      padding: '16px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(0,0,0,0.08)',
      ...(headerConfig.sticky ? { position: 'sticky', top: 0, zIndex: 100 } : {}),
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" style={{ height: `${logoHeight}px`, objectFit: 'contain' }} />
        ) : (
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: primaryColor, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '0.875rem',
          }}>
            SR
          </div>
        )}
        <span style={{ fontWeight: 700, fontSize: '1rem', color: textColor }}>{companyName}</span>
      </div>

      <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        {defaultNavLinks
          .filter((link) => link.isVisible !== false)
          .map((link, i) => (
            <a
              key={i}
              href={buildNavHref(link.targetSectionId)}
              style={{
                fontSize: '0.875rem', color: textColor, opacity: 0.7,
                cursor: 'pointer', textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
            >
              {link.label}
            </a>
          ))}
        {ctaButton?.isVisible !== false && (
          <a
            href={ctaButton?.link || buildNavHref()}
            style={btnStyles[buttonStyle] || btnStyles.filled}
          >
            {ctaButton?.text || 'Apply Now'}
          </a>
        )}
      </nav>
    </header>
  );
}
