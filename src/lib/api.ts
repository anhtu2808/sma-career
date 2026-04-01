import type { ApiResponse, CareerPageData } from "@/types/career-page";

const API_VERSION = "/v1";
// const BASE_URL =
//   process.env.NEXT_PUBLIC_API_URL || "https://api.smartrecruit.tech"; 

const BASE_URL = "https://api.smartrecruit.tech"
/**
 * Generic server-side fetch helper.
 * Used for SSR data fetching in Next.js server components.
 */
async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T> | null> {
  const url = `${BASE_URL}${path}`;

  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
      cache: "no-store", // Always fetch the latest version directly from the API
    });

    if (!res.ok) {
      console.error(`API responded with ${res.status} for ${url}`);
      return null;
    }

    const json: ApiResponse<T> = await res.json();
    return json;
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    return null;
  }
}

/**
 * Fetch a public career page by slug.
 * Endpoint: GET /v1/career-pages/public/{slug}
 */
export async function getCareerPageBySlug(
  slug: string
): Promise<CareerPageData | null> {
  try {
    const response = await apiFetch<CareerPageData>(
      `${API_VERSION}/career-pages/public/${slug}`
    );
    if (response && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch career page for slug "${slug}":`, error);
    return null;
  }
}

// ── Client-side Jobs API ───────────────────────────────────

export interface JobApiItem {
  id: number;
  name: string;
  company?: { name?: string; logo?: string; country?: string };
  locations?: { city?: string; name?: string }[];
  salaryStart?: number;
  salaryEnd?: number;
  experienceTime?: number;
  jobLevel?: string;
  workingModel?: string;
  expertise?: { id: number; name?: string };
  skills?: { id: number; name: string }[];
  domains?: { id: number; name: string }[];
  uploadTime?: string;
  expDate?: string;
  isHighlight?: boolean;
  isApplied?: boolean;
}

export interface JobBenefit {
  id: number;
  name: string;
  description?: string;
  type?: string;
  companyId?: number;
}

export interface JobLocation {
  id: number;
  name?: string;
  address?: string;
  district?: string;
  city?: string;
  country?: string;
  description?: string;
  longitude?: number;
  latitude?: number;
  googleMapLink?: string;
}

export interface JobDetailData {
  id: number;
  name: string;
  uploadTime?: string;
  expDate?: string;
  salaryStart?: number;
  salaryEnd?: number;
  currency?: string;
  experienceTime?: number;
  status?: string;
  jobLevel?: string;
  workingModel?: string;
  expertise?: { id: number; name?: string };
  company?: {
    id?: number;
    name?: string;
    country?: string;
    companyIndustry?: string;
    link?: string;
    logo?: string;
    description?: string;
  };
  skills?: { id: number; name: string; description?: string }[];
  domains?: { id: number; name: string; description?: string }[];
  benefits?: JobBenefit[];
  locations?: JobLocation[];
  isHighlight?: boolean;
  about?: string;
  responsibilities?: string;
  requirement?: string;
  quantity?: number;
  totalApplications?: number;
  canApply?: boolean;
}

/**
 * Fetch a single job detail by ID.
 * Endpoint: GET /v1/jobs/{id}
 */
export async function fetchJobDetail(jobId: number): Promise<JobDetailData | null> {
  try {
    const res = await fetch(`${BASE_URL}${API_VERSION}/jobs/${jobId}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`Job detail API responded with ${res.status}`);
      return null;
    }
    const json = await res.json();
    return json?.data || json || null;
  } catch (err) {
    console.error("fetchJobDetail error:", err);
    return null;
  }
}

export interface JobsPageData {
  content: JobApiItem[];
  totalPages: number;
  totalElements: number;
}

export interface FetchJobsParams {
  companyId: number;
  status?: string;
  page?: number;
  size?: number;
  name?: string;
  location?: string;
  jobLevel?: string;
  workingModel?: string;
  skillId?: number[];
  expertiseId?: number[];
  domainId?: number[];
  salaryStart?: string;
  salaryEnd?: string;
  minExperienceTime?: string;
  maxExperienceTime?: string;
}

/**
 * Client-side fetch for jobs list.
 */
export async function fetchJobs(
  params: FetchJobsParams
): Promise<JobsPageData | null> {
  try {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    }

    const url = `${BASE_URL}${API_VERSION}/jobs?${searchParams.toString()}`;
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Jobs API responded with ${res.status}`);
      return null;
    }

    const json = await res.json();
    const data = json?.data || json;
    return {
      content: data?.content || [],
      totalPages: data?.totalPages || 0,
      totalElements: data?.totalElements || 0,
    };
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return null;
  }
}

// ── Shared Option APIs ──────────────────────────────────────

export interface OptionItem {
  id: number;
  name: string;
}

export async function fetchSkills(): Promise<OptionItem[]> {
  try {
    const res = await fetch(`${BASE_URL}${API_VERSION}/skills?page=0&size=100`);
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.content || json?.content || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function fetchExpertises(): Promise<OptionItem[]> {
  try {
    const res = await fetch(`${BASE_URL}${API_VERSION}/expertises?page=0&size=100`);
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.content || json?.content || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function fetchDomains(): Promise<OptionItem[]> {
  try {
    const res = await fetch(`${BASE_URL}${API_VERSION}/domains?page=0&size=100`);
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.content || json?.content || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

// ── Application & Resume APIs ────────────────────────────────

export async function uploadFile(file: File): Promise<{ downloadUrl: string; originalFileName: string } | null> {
  const formData = new FormData();
  formData.append("files", file);
  try {
    const res = await fetch(`${BASE_URL}/files/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("File upload failed");
    const json = await res.json();
    const data = json?.data || json;
    const uploadedFile = Array.isArray(data) ? data[0] : data;
    return uploadedFile || null;
  } catch (err) {
    console.error("uploadFile error:", err);
    throw err;
  }
}

export async function uploadPublicResume(payload: { resumeName: string; fileName: string; resumeUrl: string }): Promise<number> {
  try {
    const res = await fetch(`${BASE_URL}${API_VERSION}/resumes/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errorJson = await res.json().catch(() => null);
      throw new Error(errorJson?.message || "Failed to register resume");
    }
    const json = await res.json();
    return json?.data?.id || json?.id;
  } catch (err) {
    console.error("uploadPublicResume error:", err);
    throw err;
  }
}

export async function publicApplyJob(payload: {
  jobId: number;
  resumeId: number;
  fullName: string;
  phone: string;
  email: string;
  coverLetter?: string;
  appliedAt: string;
  answers: any[];
}): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}${API_VERSION}/applications/public-apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errorJson = await res.json().catch(() => null);
      throw new Error(errorJson?.message || "Failed to apply for job");
    }
    return true;
  } catch (err) {
    console.error("publicApplyJob error:", err);
    throw err;
  }
}

export interface JobQuestion {
  id: number;
  content: string;
  isRequired: boolean;
}

export async function fetchJobQuestions(jobId: number): Promise<JobQuestion[]> {
  try {
    const res = await fetch(`${BASE_URL}${API_VERSION}/jobs/${jobId}/questions?page=0&size=100`);
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.content || json?.content || json?.data || [];
  } catch (err) {
    console.error("fetchJobQuestions error:", err);
    return [];
  }
}

