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
    console.log(`Attempting to fetch article: ${slug} (${language})`);
    const articlesDirectory = getArticlesDirectory(language);
    const fullPath = path.join(articlesDirectory, `${slug}.md`);

    console.log(`Looking for file at: ${fullPath}`);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.log(`File not found for ${language}: ${fullPath}`);
      // If not found and not English, try English version
      if (language !== "en") {
        console.log(`Attempting to fetch English version for ${slug}`);
        const englishArticle = getArticleBySlug(slug, "en");
        if (englishArticle) {
          // Update the language field to match the requested language
          return {
            ...englishArticle,
            language,
            id: `${language}-${slug}`,
          };
        }
      }
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
      content: content,
      language,
      translations: data.translations || {},
    };

    return article;
  } catch (error) {
    console.error(
      `Error getting article by slug ${slug} (${language}):`,
      error
    );
    // If error occurs and not in English, try English version
    if (language !== "en") {
      console.log(`Attempting to fetch English version after error`);
      const englishArticle = getArticleBySlug(slug, "en");
      if (englishArticle) {
        // Update the language field to match the requested language
        return {
          ...englishArticle,
          language,
          id: `${language}-${slug}`,
        };
      }
    }
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const language = searchParams.get("language") || "en";

    if (!slug) {
      return NextResponse.json(
        { error: "Missing required parameter: slug" },
        { status: 400 }
      );
    }

    console.log(`Fetching article: ${slug} (${language})`);
    const article = getArticleBySlug(slug, language as string);

    if (!article) {
      console.log(`Article not found: ${slug} (${language})`);
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
