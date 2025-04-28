"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, HeartHandshake, Instagram } from "lucide-react";
import { fetchArticleBySlug } from "../lib/articles";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLanguageChanging, setIsLanguageChanging] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, translations } = useLanguage();

  // Update path state after hydration to ensure consistent rendering
  useEffect(() => {
    setCurrentPath(pathname || "");
  }, [pathname]);

  // Create navigation items with proper server/client compatibility
  // Important: For server-rendering, we can't use dynamic language-based paths initially
  const navigationItems = [
    { name: translations?.navigation?.events || "Events", href: "/" },
    { name: translations?.navigation?.dojos || "Dojos", href: "/dojos" },
    {
      name: translations?.navigation?.organisations || "Organisations",
      href: "/organisations",
    },
    {
      name: translations?.navigation?.articles || "Articles",
      href: "/articles",
    },
    { name: translations?.navigation?.contact || "Contact", href: "/contact" },
  ];

  // Get correct localized navigation items with language prefix (for client-side only)
  const getLocalizedNavItems = () =>
    navigationItems.map((item) => ({
      ...item,
      href: item.href === "/" ? `/${language}` : `/${language}${item.href}`,
    }));

  // Use client-side navigation calculation only after hydration
  const [navigation, setNavigation] = useState(navigationItems);
  useEffect(() => {
    // Only update navigation items after initial hydration
    setNavigation(getLocalizedNavItems());
  }, [language]); // eslint-disable-line react-hooks/exhaustive-deps

  const languages = [
    { code: "en", name: "English" },
    { code: "de", name: "Deutsch" },
    { code: "fr", name: "Français" },
    { code: "it", name: "Italiano" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language);

  const supportLink =
    "https://go.twint.ch/1/e/tw?tw=acq.8Se8HLqcRD2xXAosggSCW4fNjeLkaz61TLijTxqo6cVKG2e-WVD9I-bxAST4IOD9";

  const instagramLink = "https://www.instagram.com/swiss_bjj_events/";

  // Check if a route is active with server/client path compatibility
  const isActiveRoute = (href: string) => {
    if (!currentPath) return false;

    // Client-side localized path (with language)
    const localizedHref = href === "/" ? `/${language}` : `/${language}${href}`;

    // For the homepage
    if (
      (href === "/" && currentPath === "/") ||
      (localizedHref === `/${language}` && currentPath === `/${language}`)
    ) {
      return true;
    }

    // Check for both versions of the path (with and without language prefix)
    return currentPath === href || currentPath === localizedHref;
  };

  // Handle language changes with proper path handling for all routes
  const handleLanguageChange = async (newLang: string) => {
    if (isLanguageChanging) return; // Prevent multiple rapid changes

    setIsLanguageChanging(true);

    try {
      // Check if we're on an article page with translations
      const isArticlePage = pathname?.includes("/articles/");

      if (isArticlePage && pathname) {
        // Get current language and slug from the URL
        const pathParts = pathname.split("/");
        if (pathParts.length >= 4) {
          const currentLang = pathParts[1];
          const slug = pathParts[3]; // /en/articles/slug-name

          try {
            // Fetch article data to check translations
            const article = await fetchArticleBySlug(slug, currentLang);

            if (
              article?.translations &&
              article.translations[newLang as keyof typeof article.translations]
            ) {
              // If translation exists, navigate to it
              const translatedSlug =
                article.translations[
                  newLang as keyof typeof article.translations
                ].slug;
              router.push(`/${newLang}/articles/${translatedSlug}`);
            } else {
              // If no translation, just change the language and go to articles list
              setLanguage(newLang as "en" | "de" | "fr" | "it");
              router.push(`/${newLang}/articles`);
            }
          } catch (error) {
            console.error("Error fetching article:", error);
            // On error, just change language
            setLanguage(newLang as "en" | "de" | "fr" | "it");
            router.push(`/${newLang}/articles`);
          }
        } else {
          // For the articles list page, navigate to the article list in the new language
          setLanguage(newLang as "en" | "de" | "fr" | "it");
          router.push(`/${newLang}/articles`);
        }
      } else {
        // For non-article pages
        setLanguage(newLang as "en" | "de" | "fr" | "it");

        // Update path for all routes
        if (pathname) {
          // Check if the current path starts with a language code
          const pathParts = pathname.split("/");
          const isLangPath =
            pathParts.length > 1 &&
            ["en", "de", "fr", "it"].includes(pathParts[1]);

          // For server-rendered routes without language, need to add language
          // For routes with language, just replace the language part
          let newPath;
          if (isLangPath) {
            // Replace the language part of the path
            pathParts[1] = newLang;
            newPath = pathParts.join("/");
          } else if (pathname === "/") {
            // Handle root path
            newPath = `/${newLang}`;
          } else {
            // For routes without language code, just add the language
            // For example, /dojos → /en/dojos
            newPath = `/${newLang}${pathname}`;
          }

          // Update navigation state for client
          setNavigation(
            navigationItems.map((item) => ({
              ...item,
              href:
                item.href === "/" ? `/${newLang}` : `/${newLang}${item.href}`,
            }))
          );

          router.push(newPath);
        }
      }

      // Close mobile menu if open
      if (isOpen) setIsOpen(false);
    } catch (error) {
      console.error("Error changing language:", error);
      // On any error, at least change the language
      setLanguage(newLang as "en" | "de" | "fr" | "it");
    } finally {
      // Reset flag after a short delay
      setTimeout(() => {
        setIsLanguageChanging(false);
      }, 500);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/logo.png"
                  alt="Swiss BJJ Logo"
                  width={40}
                  height={40}
                  className="rounded-[10%]"
                />
                <span className="text-xl font-bold">Swiss BJJ</span>
              </Link>
            </div>
          </div>

          {/* Desktop menu - changed from sm: to lg: to accommodate iPad Air and smaller devices */}
          <div className="hidden lg:flex lg:items-center">
            <div className="flex space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={
                    isActiveRoute(item.href)
                      ? "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                      : "text-gray-900 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  }
                >
                  {item.name}
                </Link>
              ))}
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-2 text-blue-700 hover:text-green-700 rounded-md"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={supportLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <button className="bg-black text-white flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-800">
                  <Image
                    src="https://play-lh.googleusercontent.com/pGZsOWcRRSQLNncRTfhGQKP_Oql9-ZmtdygrFd8myq7wONKa-INO-gFSy1xp5BL2yA"
                    alt="TWINT"
                    width={24}
                    height={24}
                    className="rounded"
                  />
                  <span>Support project</span>
                  <HeartHandshake className="h-4 w-4 ml-1" />
                </button>
              </a>
            </div>
            <div className="ml-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100">
                  <span>{currentLanguage?.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white border border-gray-200 shadow-md rounded-md"
                >
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`${
                        language === lang.code ? "bg-gray-100" : ""
                      } hover:bg-gray-100 transition-colors cursor-pointer`}
                      disabled={isLanguageChanging}
                    >
                      {lang.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile menu button - changed from sm:hidden to lg:hidden */}
          <div className="lg:hidden flex items-center">
            {/* Mobile language switcher */}
            <div className="flex mr-3 space-x-1 border rounded-md p-0.5 bg-gray-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`text-xs font-medium px-2 py-1 rounded-md transition-colors ${
                    language === lang.code
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                  aria-label={`Switch language to ${lang.name}`}
                  disabled={isLanguageChanging}
                >
                  {lang.code.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - changed from sm:hidden to lg:hidden */}
      {isOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={
                  isActiveRoute(item.href)
                    ? "bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
                    : "text-gray-900 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                }
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <a
              href={instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 rounded-md text-gray-900 hover:bg-gray-700 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <Instagram className="h-5 w-5 mr-2" />
              <span>Instagram</span>
            </a>
            <a
              href={supportLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2"
            >
              <button className="bg-black text-white flex items-center space-x-2 px-3 py-2 rounded-md w-full hover:bg-gray-800">
                <Image
                  src="https://play-lh.googleusercontent.com/pGZsOWcRRSQLNncRTfhGQKP_Oql9-ZmtdygrFd8myq7wONKa-INO-gFSy1xp5BL2yA"
                  alt="TWINT"
                  width={24}
                  height={24}
                  className="rounded"
                />
                <span>Support project</span>
                <HeartHandshake className="h-4 w-4 ml-1" />
              </button>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
