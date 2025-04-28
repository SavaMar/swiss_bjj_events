import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NextResponse } from "next/server";

// Define article interface with multilingual support
export interface MultilingualArticle {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  slug: string;
  tags: string[];
  coverImage?: string;
  content?: string;
  language: string;
  translations?: {
    [key: string]: {
      slug: string;
      title: string;
    };
  };
}

// Get the base directory for articles
const getArticlesDirectory = (language: string) =>
  path.join(process.cwd(), `app/articles/data/${language}`);

/**
 * Get article data by slug and language
 */
function getArticleBySlug(
  slug: string,
  language: string = "en"
): MultilingualArticle | null {
  try {
    const articlesDirectory = getArticlesDirectory(language);
    const fullPath = path.join(articlesDirectory, `${slug}.md`);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the article metadata
    const { data, content } = matter(fileContents);

    // Ensure article has all required fields
    if (!data.title || !data.excerpt || !data.author || !data.date) {
      console.error(
        `Article ${slug} (${language}) is missing required frontmatter fields`
      );
      return null;
    }

    // Create article object with language
    const article: MultilingualArticle = {
      id: `${language}-${slug}`,
      slug,
      title: data.title,
      excerpt: data.excerpt,
      author: data.author,
      date: data.date,
      tags: data.tags || [],
      coverImage: data.coverImage,
      content,
      language,
      translations: data.translations || {},
    };

    return article;
  } catch (error) {
    console.error(
      `Error getting article by slug ${slug} (${language}):`,
      error
    );
    return null;
  }
}

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

  const article = getArticleBySlug(slug, language as string);

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json(article);
}
