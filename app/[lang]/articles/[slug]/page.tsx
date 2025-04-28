"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { format, parseISO } from "date-fns";
import { de, fr, it } from "date-fns/locale";
import { useLanguage } from "../../../context/LanguageContext";
import ReactMarkdown from "react-markdown";
import {
  fetchArticleBySlug,
  fetchArticleTranslations,
} from "../../../lib/articles";
import ArticleSeo from "../../../components/ArticleSeo";

// Import the article interface without the server functions
type MultilingualArticle = {
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
};

// Date formatting with localization
const locales = {
  en: undefined,
  de: de,
  fr: fr,
  it: it,
};

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const [article, setArticle] = useState<MultilingualArticle | null>(null);
  const [translations, setTranslations] = useState<
    {
      language: string;
      slug: string;
      title: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the language and slug from the URL parameters
  const slug = params?.slug as string;
  const currentLang = (params?.lang as string) || "en";

  useEffect(() => {
    // Load article data using client-side fetch
    const loadArticle = async () => {
      if (!slug || !currentLang) {
        setLoading(false);
        setError("Missing slug or language parameter");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch article data from the API
        const articleData = await fetchArticleBySlug(slug, currentLang);

        if (articleData) {
          setArticle(articleData);

          // Fetch translations separately from the API
          const translationData = await fetchArticleTranslations(
            slug,
            currentLang
          );
          setTranslations(translationData);
        } else {
          // If article not found, set error
          setError(`Article not found: ${slug}`);
          // Delayed redirect to avoid immediate navigation that might cause issues
          setTimeout(() => {
            router.push(`/${currentLang}/articles`);
          }, 2000);
        }
      } catch (error) {
        console.error("Error loading article:", error);
        setError(
          `Error loading article: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug && currentLang) {
      loadArticle();
    }
  }, [slug, currentLang, router]);

  // Client-side only date formatter to avoid hydration mismatches
  const formatDate = (dateString: string) => {
    if (typeof window === "undefined") {
      return dateString; // Return unformatted on server
    }

    try {
      const date = parseISO(dateString);
      return format(date, "MMMM d, yyyy", {
        locale: locales[language as keyof typeof locales],
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href={`/${currentLang}/articles`}
          className="flex items-center text-blue-600 mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          {language === "en"
            ? "Back to Articles"
            : language === "de"
            ? "Zurück zu den Artikeln"
            : language === "fr"
            ? "Retour aux articles"
            : language === "it"
            ? "Torna agli articoli"
            : "Back to Articles"}
        </Link>

        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <p className="text-gray-600">
            {language === "en"
              ? "Redirecting to articles page..."
              : language === "de"
              ? "Weiterleitung zur Artikelseite..."
              : language === "fr"
              ? "Redirection vers la page des articles..."
              : language === "it"
              ? "Reindirizzamento alla pagina degli articoli..."
              : "Redirecting to articles page..."}
          </p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href={`/${currentLang}/articles`}
          className="flex items-center text-blue-600 mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          {language === "en"
            ? "Back to Articles"
            : language === "de"
            ? "Zurück zu den Artikeln"
            : language === "fr"
            ? "Retour aux articles"
            : language === "it"
            ? "Torna agli articoli"
            : "Back to Articles"}
        </Link>

        <div className="text-center py-12">
          <p className="text-gray-600">
            {language === "en"
              ? "Article not found"
              : language === "de"
              ? "Artikel nicht gefunden"
              : language === "fr"
              ? "Article non trouvé"
              : language === "it"
              ? "Articolo non trovato"
              : "Article not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* SEO Component */}
      {article && translations.length > 0 && (
        <ArticleSeo article={article} translations={translations} />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <Link
          href={`/${currentLang}/articles`}
          className="flex items-center text-blue-600 mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          {language === "en"
            ? "Back to Articles"
            : language === "de"
            ? "Zurück zu den Artikeln"
            : language === "fr"
            ? "Retour aux articles"
            : language === "it"
            ? "Torna agli articoli"
            : "Back to Articles"}
        </Link>

        {/* Article header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

          <div className="flex flex-wrap items-center text-sm text-gray-600 mb-6">
            <span className="mr-4">{article.author}</span>
            <span suppressHydrationWarning>{formatDate(article.date)}</span>
          </div>

          {/* Language Switcher */}
          {translations.length > 1 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2">
                {language === "en"
                  ? "Also available in:"
                  : language === "de"
                  ? "Auch verfügbar in:"
                  : language === "fr"
                  ? "Également disponible en:"
                  : language === "it"
                  ? "Disponibile anche in:"
                  : "Also available in:"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {translations
                  .filter((t) => t.language !== currentLang)
                  .map((translation) => (
                    <Link
                      key={translation.language}
                      href={`/${translation.language}/articles/${translation.slug}`}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200"
                    >
                      {translation.language === "en"
                        ? "English"
                        : translation.language === "de"
                        ? "Deutsch"
                        : translation.language === "fr"
                        ? "Français"
                        : translation.language === "it"
                        ? "Italiano"
                        : translation.language}
                    </Link>
                  ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag) => (
                <Link href={`/${currentLang}/articles?tag=${tag}`} key={tag}>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200">
                    #{tag}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Article content */}
        <div className="prose max-w-none">
          <ReactMarkdown>{article.content || ""}</ReactMarkdown>
        </div>
      </div>
    </>
  );
}
