// ── Career Page API Response Types ──────────────────────────────────────────

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface MetaConfig {
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  faviconUrl?: string;
  [key: string]: unknown;
}

export interface NavLink {
  label: string;
  targetSectionId?: string;
  isExternal?: boolean;
  url?: string;
  isVisible?: boolean;
}

export interface CTAButton {
  text?: string;
  link?: string;
  isVisible?: boolean;
}

export interface HeaderConfig {
  logoUrl?: string;
  logoHeight?: number;
  sticky?: boolean;
  navLinks?: NavLink[];
  ctaButton?: CTAButton;
  companyName?: string;
  _visible?: boolean;
  [key: string]: unknown;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export interface ThemeTypography {
  fontFamily: string;
  baseFontSize: number;
}

export interface ThemeStyling {
  borderRadius: number;
  buttonStyle: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  typography: ThemeTypography;
  styling: ThemeStyling;
  [key: string]: unknown;
}

/** Flattened theme for component consumption */
export interface FlatTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  baseFontSize: number;
  borderRadius: number;
  buttonStyle: string;
  shadow: string;
  spacing: string;
}

export interface LayoutSectionSettings {
  paddingTop?: number;
  paddingBottom?: number;
  textAlign?: string;
  backgroundColorOverride?: string;
  [key: string]: unknown;
}

export interface LayoutSection {
  id: string;
  type: string;
  order: number;
  isVisible: boolean;
  props: Record<string, unknown>;
  settings?: LayoutSectionSettings;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  addresses?: string[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface FooterConfig {
  companyName?: string;
  address?: string;
  contact?: ContactInfo;
  socialLinks?: SocialLink[];
  copyrightText?: string;
  _visible?: boolean;
  [key: string]: unknown;
}

export interface CareerPageData {
  id: number;
  companyId: number;
  slug: string;
  status: string;
  version: number;
  metaConfig: MetaConfig;
  headerConfig: HeaderConfig;
  themeConfig: ThemeConfig;
  layoutConfig: LayoutSection[];
  footerConfig: FooterConfig;
  createdAt: string;
  updatedAt: string;
}
