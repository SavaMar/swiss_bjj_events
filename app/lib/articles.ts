import { MultilingualArticle } from "../api/articles/route";

/**
 * Checks if articles exist for a specific language
 * @param language The language code (default: 'en')
 * @returns A Promise resolving to an object with exists and count properties
 */
export async function checkArticlesExist(
  language = "en"
): Promise<{ exists: boolean; articleCount: number }> {
  try {
    const response = await fetch(`/api/articles/data?language=${language}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to check articles: ${response.status}`);
    }

    const data = await response.json();
    return {
      exists: data.exists,
      articleCount: data.articleCount,
    };
  } catch (error) {
    console.error("Error checking articles:", error);
    return { exists: false, articleCount: 0 };
  }
}

/**
 * Fetches all articles for the specified language
 * @param language The language code (default: 'en')
 * @returns A Promise resolving to an array of articles
 */
export async function fetchAllArticles(
  language = "en"
): Promise<MultilingualArticle[]> {
  try {
    // First check if articles exist for this language
    const { exists, articleCount } = await checkArticlesExist(language);

    if (!exists || articleCount === 0) {
      console.log(`No articles found for language: ${language}, using default`);
      // If no articles exist for this language, fallback to English
      if (language !== "en") {
        return fetchAllArticles("en");
      }
      return [];
    }

    const response = await fetch(`/api/articles/all?language=${language}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

/**
 * Fetches a single article by slug and language
 * @param slug The article slug
 * @param language The language code (default: 'en')
 * @returns A Promise resolving to the article or null if not found
 */
export async function fetchArticleBySlug(
  slug: string,
  language = "en"
): Promise<MultilingualArticle | null> {
  try {
    // First check if articles exist for this language
    const { exists } = await checkArticlesExist(language);

    if (!exists && language !== "en") {
      console.log(
        `No articles found for language: ${language}, trying English`
      );
      // If no articles exist for this language, try English
      return fetchArticleBySlug(slug, "en");
    }

    const response = await fetch(
      `/api/articles?slug=${slug}&language=${language}`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (response.status === 404) {
      if (language !== "en") {
        // If article not found and not in English, try English version
        return fetchArticleBySlug(slug, "en");
      }
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching article ${slug}:`, error);
    return null;
  }
}

/**
 * Fetches translations for a specific article
 * @param slug The article slug
 * @param language The source language code (default: 'en')
 * @returns A Promise resolving to an array of translation information
 */
export async function fetchArticleTranslations(
  slug: string,
  language = "en"
): Promise<
  {
    language: string;
    slug: string;
    title: string;
  }[]
> {
  try {
    const response = await fetch(
      `/api/articles/translations?slug=${slug}&language=${language}`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch translations: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching translations for ${slug}:`, error);
    return [];
  }
}
