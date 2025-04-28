import { NextRequest, NextResponse } from "next/server";

// Default language
const defaultLanguage = "en";
// Supported languages
const supportedLocales = ["en", "de", "fr", "it"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get user's preferred language from header or cookie if available
  const acceptLanguageHeader = request.headers.get("accept-language");
  const preferredLanguage = acceptLanguageHeader
    ? acceptLanguageHeader.split(",")[0].split(";")[0].substring(0, 2)
    : null;

  // Use user's preferred language if it's in supported locales, otherwise use default
  const userLanguage =
    preferredLanguage && supportedLocales.includes(preferredLanguage)
      ? preferredLanguage
      : defaultLanguage;

  // Check if the path starts with a language code
  const pathSegments = pathname.split("/").filter(Boolean);
  const firstSegment = pathSegments[0];
  const hasLocale = supportedLocales.includes(firstSegment);

  // If root path, redirect to user's language home page
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${userLanguage}`, request.url));
  }

  // If already has a valid locale, no need to redirect
  if (hasLocale) {
    return NextResponse.next();
  }

  // Add language prefix to path for known routes without language
  if (
    pathname.startsWith("/articles") ||
    pathname.startsWith("/dojos") ||
    pathname.startsWith("/organisations") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/calendar")
  ) {
    return NextResponse.redirect(
      new URL(`/${userLanguage}${pathname}`, request.url)
    );
  }

  // For all other routes without locale, just pass through
  return NextResponse.next();
}

export const config = {
  // Configure the matcher to apply this middleware to all public routes
  matcher: [
    // Apply to all routes except those that start with:
    // _next, api, static files, and already localized routes
    "/((?!_next|api|favicon.ico|.*\\.).*)",
  ],
};
