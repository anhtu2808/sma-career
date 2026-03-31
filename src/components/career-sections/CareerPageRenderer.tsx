"use client";

import type { FlatTheme, LayoutSection, HeaderConfig, FooterConfig } from "@/types/career-page";
import HeaderSection from "./HeaderSection";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import EVPSection from "./EVPSection";
import FeaturedJobsSection from "./FeaturedJobsSection";
import AwardsSection from "./AwardsSection";
import LifeAtCompanySection from "./LifeAtCompanySection";
import GallerySection from "./GallerySection";
import ProcessSection from "./ProcessSection";
import FAQSection from "./FAQSection";
import CTASection from "./CTASection";
import FooterSection from "./FooterSection";

type SectionComponent = React.ComponentType<{
  theme: FlatTheme;
  sectionProps: Record<string, unknown>;
  settings: Record<string, unknown>;
}>;

const SECTION_COMPONENTS: Record<string, SectionComponent> = {
  HERO: HeroSection,
  ABOUT: AboutSection,
  EVP: EVPSection,
  JOBS: FeaturedJobsSection,
  AWARDS: AwardsSection,
  LIFE_AT_CO: LifeAtCompanySection,
  GALLERY: GallerySection,
  PROCESS: ProcessSection,
  FAQ: FAQSection,
  CTA_FOOTER: CTASection,
};

interface CareerPageRendererProps {
  theme: FlatTheme;
  layoutConfig: LayoutSection[];
  headerConfig: HeaderConfig;
  footerConfig: FooterConfig;
  companyId: number;
}

export default function CareerPageRenderer({
  theme,
  layoutConfig,
  headerConfig,
  footerConfig,
  companyId,
}: CareerPageRendererProps) {
  const visibleSections = layoutConfig
    .filter((s) => s.isVisible)
    .sort((a, b) => a.order - b.order);

  const showHeader = headerConfig._visible !== false;
  const showFooter = footerConfig._visible !== false;

  // Calculate spacing from theme
  const getSpacingValue = (spacing: string) => {
    switch (spacing) {
      case "compact":
        return 40;
      case "spacious":
        return 96;
      case "normal":
      default:
        return 64;
    }
  };
  const spacingPad = getSpacingValue(theme.spacing);

  return (
    <div
      style={{
        fontFamily: `'${theme.fontFamily || "Inter"}', sans-serif`,
        fontSize: `${theme.baseFontSize}px`,
        color: theme.textColor,
        background: theme.backgroundColor,
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      {showHeader && (
        <HeaderSection
          theme={theme}
          headerConfig={headerConfig}
          companyName={(headerConfig.companyName as string) || (footerConfig.companyName as string) || 'Company'}
        />
      )}

      {/* Layout Sections */}
      {visibleSections.map((section) => {
        const Component = SECTION_COMPONENTS[section.type];
        if (!Component) return null;

        const effectiveSettings = {
          ...section.settings,
          paddingTop: spacingPad,
          paddingBottom: spacingPad,
        };

        return (
          <div key={section.id} id={section.id}>
            <Component
              theme={theme}
              sectionProps={{
                ...section.props,
                ...(section.type === 'JOBS' ? { companyId } : {}),
              }}
              settings={effectiveSettings}
            />
          </div>
        );
      })}

      {/* Footer */}
      {showFooter && <FooterSection theme={theme} footerConfig={footerConfig} />}
    </div>
  );
}
