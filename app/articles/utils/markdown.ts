/**
 * SERVER-SIDE ONLY - DO NOT IMPORT INTO CLIENT COMPONENTS
 *
 * This file uses Node.js modules like 'fs' which are only available on the server.
 * Use this in API routes or Server Components only.
 * For client components, use the functions in /app/lib/articles.ts instead.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import process from "process";

// Define article interface (same as in other files)
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  slug: string;
  tags: string[];
  coverImage?: string;
  content?: string;
}

const articlesDirectory = path.join(process.cwd(), "app/articles/data");

/**
 * Get all article slugs from the articles directory
 */
export function getArticleSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(articlesDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => fileName.replace(/\.md$/, ""));
  } catch (error) {
    console.error("Error getting article slugs:", error);
    return [];
  }
}

/**
 * Get article data by slug
 */
export function getArticleBySlug(slug: string): Article | null {
  try {
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
      console.error(`Article ${slug} is missing required frontmatter fields`);
      return null;
    }

    // Create article object
    const article: Article = {
      id: slug,
      slug,
      title: data.title,
      excerpt: data.excerpt,
      author: data.author,
      date: data.date,
      tags: data.tags || [],
      coverImage: data.coverImage,
      content,
    };

    return article;
  } catch (error) {
    console.error(`Error getting article by slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get all articles
 */
export function getAllArticles(): Article[] {
  const slugs = getArticleSlugs();
  const articles = slugs
    .map((slug) => getArticleBySlug(slug))
    .filter((article): article is Article => article !== null);

  // Sort articles by date (newest first)
  return articles.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

/**
 * Get articles by tag
 */
export function getArticlesByTag(tag: string): Article[] {
  const articles = getAllArticles();
  return articles.filter((article) => article.tags.includes(tag));
}

/**
 * Get all unique tags from all articles
 */
export function getAllTags(): string[] {
  const articles = getAllArticles();
  const tagsSet = new Set<string>();

  articles.forEach((article) => {
    article.tags.forEach((tag) => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}
