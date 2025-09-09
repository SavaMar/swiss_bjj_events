import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
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

// Get the base directory for organization rules
const getOrganisationsDirectory = (language: string) =>
  path.join(process.cwd(), `app/organisations/data/${language}`);

// Map slugs to localized file names
const getLocalizedFileName = (slug: string, language: string): string => {
  const slugMap: { [key: string]: { [key: string]: string } } = {
    "ajp-rules": {
      de: "ajp-regeln",
      fr: "regles-ajp",
      it: "regole-ajp",
      en: "ajp-rules",
    },
    "adcc-rules": {
      de: "adcc-regeln",
      fr: "regles-adcc",
      it: "regole-adcc",
      en: "adcc-rules",
    },
    "grapplingindustries-rules": {
      de: "grapplingindustries-regeln",
      fr: "regles-grapplingindustries",
      it: "regole-grapplingindustries",
      en: "grapplingindustries-rules",
    },
    "sjja-rules": {
      de: "sjja-regeln",
      fr: "regles-sjja",
      it: "regole-sjja",
      en: "sjja-rules",
    },
  };

  return slugMap[slug]?.[language] || slug;
};

/**
 * Get article data by slug and language
 */
function getArticleBySlug(
  slug: string,
  language: string = "en"
): MultilingualArticle | null {
  try {
    console.log(`Attempting to fetch article: ${slug} (${language})`);
    const organisationsDirectory = getOrganisationsDirectory(language);
    const localizedSlug = getLocalizedFileName(slug, language);
    const fullPath = path.join(organisationsDirectory, `${localizedSlug}.md`);

    console.log(`Looking for file at: ${fullPath}`);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.log(`File not found for ${language}: ${fullPath}`);
      // If not found and not English, try English version
      if (language !== "en") {
        console.log(`Attempting to fetch English version for ${slug}`);
        const englishArticle = getArticleBySlug(slug, "en");
        if (englishArticle) {
          // Return the English version but with the requested language
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
        // Return the English version but with the requested language
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
