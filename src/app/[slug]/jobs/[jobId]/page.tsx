import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCareerPageBySlug, fetchJobDetail } from "@/lib/api";
import type { FlatTheme } from "@/types/career-page";
import HeaderSection from "@/components/career-sections/HeaderSection";
import FooterSection from "@/components/career-sections/FooterSection";
import JobDetailView from "@/views/JobDetail";
import "@/styles/career-page.css";

interface JobPageProps {
  params: Promise<{ slug: string; jobId: string }>;
}

/** Flatten themeConfig from BE structure into a single flat object */
function flattenTheme(tc: {
  colors: { primary: string; secondary: string; background: string; text: string };
  typography: { fontFamily: string; baseFontSize: number };
  styling: { borderRadius: number; buttonStyle: string };
}): FlatTheme {
  return {
    primaryColor: tc.colors.primary,
    secondaryColor: tc.colors.secondary,
    backgroundColor: tc.colors.background,
    textColor: tc.colors.text,
    fontFamily: tc.typography.fontFamily,
    baseFontSize: tc.typography.baseFontSize,
    borderRadius: tc.styling.borderRadius,
    buttonStyle: tc.styling.buttonStyle,
    shadow: "subtle",
    spacing: "normal",
  };
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { jobId } = await params;
  
  try {
    const jobDetail = await fetchJobDetail(Number(jobId));
    if (jobDetail) {
      return {
        title: `${jobDetail.name} at ${jobDetail.company?.name || "Company"}`,
        description: `Apply for ${jobDetail.name} role in ${jobDetail.locations?.map(l => l.city).join(", ")}.`,
      };
    }
  } catch (error) {
    // Ignore error and fallthrough to default metadata
  }

  return {
    title: "Job Details - Career Page",
    description: "Explore career opportunities",
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

  return (
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
        />
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1, position: "relative", zIndex: 1, background: "#f8fafc" }}>
         <JobDetailView slug={slug} jobDetail={jobDetail} theme={theme} />
      </main>

      {/* Footer */}
      {showFooter && <FooterSection theme={theme} footerConfig={pageData.footerConfig} />}
    </div>
  );
}
