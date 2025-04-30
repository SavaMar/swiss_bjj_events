import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NextResponse } from "next/server";
import { MultilingualArticle } from "../route";

// Get the base directory for articles
const getArticlesDirectory = (language: string) =>
  path.join(process.cwd(), `app/articles/data/${language}`);

/**
 * Get all article slugs across languages
 */
function getArticleSlugs(language: string = "en"): string[] {
  try {
    const articlesDirectory = getArticlesDirectory(language);

    // Check if directory exists
    if (!fs.existsSync(articlesDirectory)) {
      console.warn(`Articles directory for ${language} not found`);
      return [];
    }

    const fileNames = fs.readdirSync(articlesDirectory);

    // Filter for markdown files and remove extension
    return fileNames
      .filter((fileName) => /\.md$/.test(fileName))
      .map((fileName) => fileName.replace(/\.md$/, ""));
  } catch (error) {
    console.error(`Error getting article slugs for ${language}:`, error);
    return [];
  }
}

/**
 * Get all articles for a specific language
 */
function getAllArticles(language: string = "en"): MultilingualArticle[] {
  try {
    const slugs = getArticleSlugs(language);
    const articlesDirectory = getArticlesDirectory(language);

    const articles = slugs.map((slug) => {
      const fullPath = path.join(articlesDirectory, `${slug}.md`);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Extract frontmatter from the markdown file
      const { data, content } = matter(fileContents);

      // Skip articles with missing required fields
      if (!data.title || !data.excerpt || !data.author || !data.date) {
        console.warn(
          `Article ${slug} (${language}) is missing required frontmatter fields`
        );
        return null;
      }

      // Create article object
      const article: MultilingualArticle = {
        id: `${language}-${slug}`,
        slug,
        title: data.title,
        excerpt: data.excerpt,
        author: data.author,
        date: data.date,
        tags: data.tags || [],
        coverImage: data.coverImage
          ? data.coverImage.startsWith("http")
            ? data.coverImage
            : `https://filedn.com/lPmOLyYLDG0bQGSveFAL3WB/bjjArticles/${data.coverImage}`
          : undefined,
        content: content,
        language,
        translations: data.translations || {},
      };

      return article;
    });

    // Remove null entries and sort by date (newest first)
    return articles
      .filter((article): article is MultilingualArticle => article !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error(`Error getting all articles for ${language}:`, error);
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get("language") || "en";

  const articles = getAllArticles(language as string);

  return NextResponse.json(articles);
}
