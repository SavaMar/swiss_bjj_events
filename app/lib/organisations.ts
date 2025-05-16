import { MultilingualArticle } from "../api/organisations/route";

/**
 * Fetches a single organization rule by slug and language
 * @param slug The rule slug
 * @param language The language code (default: 'en')
 * @returns A Promise resolving to the rule or null if not found
 */
export async function fetchRuleBySlug(
  slug: string,
  language = "en"
): Promise<MultilingualArticle | null> {
  try {
    console.log(`Fetching rule: ${slug} (${language})`);
    const response = await fetch(
      `/api/organisations?slug=${slug}&language=${language}`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
      if (response.status === 404 && language !== "en") {
        console.log(`Rule not found in ${language}, falling back to English`);
        // If rule not found and not in English, try English version
        const englishRule = await fetchRuleBySlug(slug, "en");
        if (englishRule) {
          // Return the English version but with the requested language
          return {
            ...englishRule,
            language,
            id: `${language}-${slug}`,
          };
        }
      }
      throw new Error(`Failed to fetch rule: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching rule ${slug}:`, error);
    if (language !== "en") {
      console.log(`Attempting to fetch English version after error`);
      const englishRule = await fetchRuleBySlug(slug, "en");
      if (englishRule) {
        // Return the English version but with the requested language
        return {
          ...englishRule,
          language,
          id: `${language}-${slug}`,
        };
      }
    }
    return null;
  }
}
