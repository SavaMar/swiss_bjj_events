"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, HeartHandshake } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, translations } = useLanguage();

  const navigation = [
    { name: translations?.navigation?.events || "Events", href: "/" },
    { name: translations?.navigation?.dojos || "Dojos", href: "/dojos" },
    {
      name: translations?.navigation?.brands || "Local Brands",
      href: "/brands",
    },
    { name: translations?.navigation?.contact || "Contact", href: "/contact" },
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "de", name: "Deutsch" },
    { code: "fr", name: "Français" },
    { code: "it", name: "Italiano" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language);

  const supportLink =
    "https://go.twint.ch/1/e/tw?tw=acq.8Se8HLqcRD2xXAosggSCW4fNjeLkaz61TLijTxqo6cVKG2e-WVD9I-bxAST4IOD9";

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold">
                Swiss BJJ
              </Link>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center">
            <div className="flex space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? "bg-gray-900 text-white"
                      : "text-gray-900 hover:bg-gray-700 hover:text-white"
                  } px-3 py-2 rounded-md text-sm font-medium`}
                >
                  {item.name}
                </Link>
              ))}
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
                  <span>{"Support project"}</span>
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
                      onClick={() =>
                        setLanguage(lang.code as "en" | "de" | "fr" | "it")
                      }
                      className={`${
                        language === lang.code ? "bg-gray-100" : ""
                      } hover:bg-gray-100 transition-colors cursor-pointer`}
                    >
                      {lang.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
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

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? "bg-gray-900 text-white"
                    : "text-gray-900 hover:bg-gray-700 hover:text-white"
                } block px-3 py-2 rounded-md text-base font-medium`}
              >
                {item.name}
              </Link>
            ))}
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
                <span>{"Support project"}</span>
                <HeartHandshake className="h-4 w-4 ml-1" />
              </button>
            </a>
            <div className="mt-4 px-3">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-1 w-full px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100">
                  <span>{currentLanguage?.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-gray-200 shadow-md rounded-md">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() =>
                        setLanguage(lang.code as "en" | "de" | "fr" | "it")
                      }
                      className={`${
                        language === lang.code ? "bg-gray-100" : ""
                      } hover:bg-gray-100 transition-colors cursor-pointer`}
                    >
                      {lang.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
