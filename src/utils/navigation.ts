/**
 * Navigation utility for handling path differences between
 * local development (path-based routing) and production (subdomain-based routing).
 *
 * - Local:  localhost:3000/{slug}/jobs/1  → uses path-based routing, slug is in the URL
 * - Prod:   {slug}.smartrecruit.tech/jobs/1 → middleware rewrites, slug should NOT be in client paths
 */

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "smartrecruit.tech";

/**
 * Check if the current environment uses subdomain-based routing (production)
 * vs path-based routing (local development).
 * Works on both client and server side.
 */
export function isSubdomainRouting(): boolean {
  if (typeof window !== "undefined") {
    // Client-side check
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0") {
      return false;
    }
    return hostname.endsWith(`.${ROOT_DOMAIN}`);
  }

  // Server-side: check via environment variable
  // In production deployment with subdomain routing, NEXT_PUBLIC_ROOT_DOMAIN is set
  // and we're not running on localhost
  // We detect this by checking if NODE_ENV is production
  return process.env.NODE_ENV === "production";
}

/**
 * Build a navigation path that works correctly in both local and production environments.
 *
 * @param slug - The company slug
 * @param subPath - Optional sub-path after the slug (e.g., "/jobs/123")
 * @param hash - Optional hash fragment (e.g., "jobs-section")
 * @returns The correct path for the current environment
 *
 * Examples (local dev):
 *   buildPath("hutech", "")           → "/hutech"
 *   buildPath("hutech", "/jobs/123")  → "/hutech/jobs/123"
 *   buildPath("hutech", "", "about")  → "/hutech#about"
 *
 * Examples (production subdomain):
 *   buildPath("hutech", "")           → "/"
 *   buildPath("hutech", "/jobs/123")  → "/jobs/123"
 *   buildPath("hutech", "", "about")  → "/#about"
 */
export function buildPath(slug: string, subPath: string = "", hash?: string): string {
  const useSubdomain = isSubdomainRouting();
  let path: string;

  if (useSubdomain) {
    // Production: slug is already handled by subdomain, don't include it in the path
    path = subPath || "/";
  } else {
    // Local dev: include slug in the path
    path = `/${slug}${subPath}`;
  }

  if (hash) {
    path += `#${hash}`;
  }

  return path;
}
