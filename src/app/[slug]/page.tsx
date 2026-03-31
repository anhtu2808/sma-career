import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCareerPageBySlug } from "@/lib/api";
import type { FlatTheme } from "@/types/career-page";
import CareerPageRenderer from "@/components/career-sections/CareerPageRenderer";
import "@/styles/career-page.css";

interface PageProps {
  params: Promise<{ slug: string }>;
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

/** Generate dynamic SEO metadata from metaConfig */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCareerPageBySlug(slug);

  if (!data) {
    return {
      title: "Career Page Not Found",
      description: "The requested career page could not be found.",
    };
  }

  const meta = data.metaConfig || {};

  return {
    title: (meta.seoTitle as string) || `${slug} - Career Page`,
    description: (meta.seoDescription as string) || "Explore career opportunities",
    openGraph: {
      title: (meta.seoTitle as string) || `${slug} - Career Page`,
      description: (meta.seoDescription as string) || "Explore career opportunities",
      images: (meta.ogImage as string) ? [{ url: meta.ogImage as string }] : [],
    },
  };
}

export default async function CareerPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getCareerPageBySlug(slug);

  if (!data) {
    notFound();
  }

  const theme = flattenTheme(data.themeConfig);

  return (
    <CareerPageRenderer
      theme={theme}
      layoutConfig={data.layoutConfig}
      headerConfig={data.headerConfig}
      footerConfig={data.footerConfig}
      companyId={data.companyId}
    />
  );
}
