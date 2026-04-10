import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCareerPageBySlug } from "@/lib/api";
import type { FlatTheme, ThemeConfig } from "@/types/career-page";
import CareerPageRenderer from "@/components/career-sections/CareerPageRenderer";
import "@/styles/career-page.css";

interface PageProps {
  params: Promise<{ slug: string }>;
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
  const iconUrl = meta.faviconUrl || data.headerConfig?.logoUrl;

  return {
    title: (meta.seoTitle as string) || `${slug} - Career Page`,
    description: (meta.seoDescription as string) || "Explore career opportunities",
    openGraph: {
      title: (meta.seoTitle as string) || `${slug} - Career Page`,
      description: (meta.seoDescription as string) || "Explore career opportunities",
      images: (meta.ogImage as string) ? [{ url: meta.ogImage as string }] : [],
    },
    icons: iconUrl ? { icon: iconUrl as string } : undefined,
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
