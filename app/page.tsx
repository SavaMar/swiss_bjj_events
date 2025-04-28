import { redirect } from "next/navigation";

// Default redirect page
export default function HomePage() {
  // Redirect to English page (handled by middleware but this is a fallback)
  redirect("/en");

  // This won't be rendered but is needed for TypeScript
  return null;
}
