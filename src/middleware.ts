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

  // Remove port if present (e.g., smartrecruit.tech:3000)
  const hostWithoutPort = hostname.split(':')[0];

  // If accessing the root domain or www directly, skip routing
  if (hostWithoutPort === ROOT_DOMAIN || hostWithoutPort === `www.${ROOT_DOMAIN}`) {
    return NextResponse.next();
  }

  // Extract subdomain: e.g., "hutechh.smartrecruit.tech" → "hutechh"
  let subdomain = "";
  if (hostWithoutPort.endsWith(`.${ROOT_DOMAIN}`)) {
    subdomain = hostWithoutPort.replace(`.${ROOT_DOMAIN}`, "").toLowerCase();
  }

  // Skip if no subdomain found
  if (!subdomain) {
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
