import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCareerPageBySlug, fetchJobDetail } from "@/lib/api";
import type { FlatTheme, ThemeConfig } from "@/types/career-page";
import HeaderSection from "@/components/career-sections/HeaderSection";
import FooterSection from "@/components/career-sections/FooterSection";
import JobDetailView from "@/views/JobDetail";
import "@/styles/career-page.css";

interface JobPageProps {
  params: Promise<{ slug: string; jobId: string }>;
}

/** Flatten themeConfig from BE structure into a single flat object */
function flattenTheme(tc: ThemeConfig): FlatTheme {
  return {
    primaryColor: tc.colors?.primary || "#0f172a",
    secondaryColor: tc.colors?.secondary || "#f8fafc",
    backgroundColor: tc.colors?.background || "#ffffff",
    textColor: tc.colors?.text || "#0f172a",
    fontFamily: tc.typography?.fontFamily || "Inter",
    baseFontSize: tc.typography?.baseFontSize || 16,
    borderRadius: tc.styling?.borderRadius || 8,
    buttonStyle: tc.styling?.buttonStyle || "solid",
    shadow: tc.effects?.shadow || "subtle",
    spacing: tc.effects?.spacing || "normal",
  };
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { slug, jobId } = await params;
  
  // Try to fetch career page data for favicon
  const pageData = await getCareerPageBySlug(slug).catch(() => null);
  const iconUrl = pageData?.metaConfig?.faviconUrl || pageData?.headerConfig?.logoUrl || undefined;

  try {
    const jobDetail = await fetchJobDetail(Number(jobId));
    if (jobDetail) {
      return {
        title: `${jobDetail.name} at ${jobDetail.company?.name || "Company"}`,
        description: `Apply for ${jobDetail.name} role in ${jobDetail.locations?.map(l => l.city).join(", ")}.`,
        icons: iconUrl ? { icon: iconUrl as string } : undefined,
      };
    }
  } catch (error) {
    // Ignore error and fallthrough to default metadata
  }

  return {
    title: "Job Details - Career Page",
    description: "Explore career opportunities",
    icons: iconUrl ? { icon: iconUrl as string } : undefined,
  };
}

export default async function JobDetailPage({ params }: JobPageProps) {
  const { slug, jobId } = await params;
  
  // Fetch site configuration and theme
  const pageData = await getCareerPageBySlug(slug);
  if (!pageData) {
    notFound();
  }

  // Fetch job details
  let jobDetail = null;
  try {
    jobDetail = await fetchJobDetail(Number(jobId));
  } catch (err) {
    // We let jobDetail remain null, JobDetailView will handle empty state.
    console.error("Failed to fetch job detail:", err);
  }

  const theme = flattenTheme(pageData.themeConfig);
  const showHeader = pageData.headerConfig._visible !== false;
  const showFooter = pageData.footerConfig._visible !== false;
  const companyName = (pageData.headerConfig.companyName as string) || (pageData.footerConfig.companyName as string) || 'Company';

  // dynamically load google font if it's not Inter
  const fontUrl = theme.fontFamily && theme.fontFamily !== "Inter" 
    ? `https://fonts.googleapis.com/css2?family=${theme.fontFamily.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800&display=swap`
    : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          ${fontUrl ? `@import url('${fontUrl}');` : ''}
          :root { font-size: ${theme.baseFontSize}px; }
        `
      }} />
      <div
        style={{
          fontFamily: `'${theme.fontFamily || "Inter"}', sans-serif`,
          fontSize: `${theme.baseFontSize}px`,
          color: theme.textColor,
          background: theme.backgroundColor,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
      {/* Header */}
      {showHeader && (
        <HeaderSection
          theme={theme}
          headerConfig={pageData.headerConfig}
          companyName={companyName}
          slug={slug}
        />
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1, position: "relative", zIndex: 1, background: "#f8fafc" }}>
         <JobDetailView slug={slug} jobDetail={jobDetail} theme={theme} />
      </main>

      {/* Footer */}
      {showFooter && <FooterSection theme={theme} footerConfig={pageData.footerConfig} />}
    </div>
    </>
  );
}
