import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware to handle subdomain-based routing.
 *
 * Deployment pattern: {slug}.smartrecruit.tech → rewrite to /{slug}
 *
 * This extracts the subdomain from the hostname and rewrites the request
 * to the dynamic [slug] route so the career page is rendered.
 */

// The root domain (without any subdomain)
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "smartrecruit.tech";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";

  // Skip for localhost development (use path-based routing)
  if (
    hostname.includes("localhost") ||
    hostname.includes("127.0.0.1") ||
    hostname.includes("0.0.0.0")
  ) {
    return NextResponse.next();
  }

  // Extract subdomain: e.g., "hutechh.smartrecruit.tech" → "hutechh"
  const subdomain = hostname.replace(`.${ROOT_DOMAIN}`, "").split(".")[0];

  // Skip if no subdomain (root domain access) or if it's "www"
  if (!subdomain || subdomain === ROOT_DOMAIN.split(".")[0] || subdomain === "www") {
    return NextResponse.next();
  }

  // Skip for static files and Next.js internals
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.includes(".") // static files like .ico, .css, etc.
  ) {
    return NextResponse.next();
  }

  // Rewrite: hutechh.smartrecruit.tech/ → /hutechh
  // Rewrite: hutechh.smartrecruit.tech/jobs → /hutechh/jobs (future subpages)
  if (url.pathname === "/" || url.pathname === "") {
    url.pathname = `/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  // For any other path under the subdomain, prepend the slug
  url.pathname = `/${subdomain}${url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
