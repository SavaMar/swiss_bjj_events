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
 * Get all article slugs from a specific language directory
 */
export function getArticleSlugs(language: string = "en"): string[] {
  try {
    const articlesDirectory = getArticlesDirectory(language);

    // Check if directory exists
    if (!fs.existsSync(articlesDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(articlesDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => fileName.replace(/\.md$/, ""));
  } catch (error) {
    console.error(
      `Error getting article slugs for language ${language}:`,
      error
    );
    return [];
  }
}

/**
 * Get article data by slug and language
 */
export function getArticleBySlug(
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

/**
 * Get all articles for a specific language
 */
export function getAllArticles(language: string = "en"): MultilingualArticle[] {
  const slugs = getArticleSlugs(language);
  const articles = slugs
    .map((slug) => getArticleBySlug(slug, language))
    .filter((article): article is MultilingualArticle => article !== null);

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
 * Get articles by tag for a specific language
 */
export function getArticlesByTag(
  tag: string,
  language: string = "en"
): MultilingualArticle[] {
  const articles = getAllArticles(language);
  return articles.filter((article) => article.tags.includes(tag));
}

/**
 * Get all unique tags from all articles in a specific language
 */
export function getAllTags(language: string = "en"): string[] {
  const articles = getAllArticles(language);
  const tagsSet = new Set<string>();

  articles.forEach((article) => {
    article.tags.forEach((tag) => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}

/**
 * Get all languages that have a translation for a specific article
 */
export function getArticleTranslations(
  slug: string,
  language: string = "en"
): {
  language: string;
  slug: string;
  title: string;
}[] {
  const article = getArticleBySlug(slug, language);
  if (!article || !article.translations) {
    return [];
  }

  const translations = Object.entries(article.translations).map(
    ([lang, data]) => ({
      language: lang,
      slug: data.slug,
      title: data.title,
    })
  );

  // Add the current article language
  translations.push({
    language: article.language,
    slug: article.slug,
    title: article.title,
  });

  return translations;
}

/**
 * Check if article exists in a specific language
 */
export function articleExists(slug: string, language: string = "en"): boolean {
  const articlesDirectory = getArticlesDirectory(language);
  const fullPath = path.join(articlesDirectory, `${slug}.md`);
  return fs.existsSync(fullPath);
}

/**
 * Get an article in the best possible language (fallback to default if needed)
 */
export function getArticleInBestLanguage(
  slug: string,
  preferredLanguage: string = "en",
  defaultLanguage: string = "en"
): MultilingualArticle | null {
  // Try to get article in preferred language
  let article = getArticleBySlug(slug, preferredLanguage);

  // If article doesn't exist in preferred language, try to find a translation
  if (!article) {
    // Get article in default language
    const defaultArticle = getArticleBySlug(slug, defaultLanguage);

    // If default article exists and has translations
    if (defaultArticle && defaultArticle.translations) {
      // Check if there's a translation in the preferred language
      const translation = defaultArticle.translations[preferredLanguage];
      if (translation) {
        // Get the article using the translation slug
        article = getArticleBySlug(translation.slug, preferredLanguage);
      }
    }

    // If still no article, return the default language article
    if (!article) {
      return defaultArticle;
    }
  }

  return article;
}
