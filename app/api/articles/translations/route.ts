import { NextResponse } from "next/server";
import { getArticleTranslations } from "../../../articles/utils/multilingual-markdown";

/**
 * API route to get translations for a specific article
 * @route GET /api/articles/translations?slug={slug}&language={language}
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const language = searchParams.get("language") || "en";

  if (!slug) {
    return NextResponse.json(
      { error: "Missing required parameter: slug" },
      { status: 400 }
    );
  }

  const translations = getArticleTranslations(slug, language as string);

  return NextResponse.json(translations);
}
