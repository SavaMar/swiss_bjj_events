"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";
import { HeartHandshake } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { translations, language } = useLanguage();

  const supportLink =
    "https://go.twint.ch/1/e/tw?tw=acq.8Se8HLqcRD2xXAosggSCW4fNjeLkaz61TLijTxqo6cVKG2e-WVD9I-bxAST4IOD9";

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Swiss BJJ</h3>
            <p className="text-gray-300">
              {translations?.footer?.description ||
                "Connecting the Swiss Brazilian Jiu-Jitsu community through events, dojos, and local brands."}
            </p>
            <div className="mt-4">
              <a
                href={supportLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
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
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {translations?.footer?.quickLinks || "Quick Links"}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  {translations?.navigation?.events || "Events"}
                </Link>
              </li>
              <li>
                <Link href="/dojos" className="text-gray-300 hover:text-white">
                  {translations?.navigation?.dojos || "Dojos"}
                </Link>
              </li>
              <li>
                <Link
                  href="/organisations"
                  className="text-gray-300 hover:text-white"
                >
                  {translations?.navigation?.organisations || "Organisations"}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${language}/articles`}
                  className="text-gray-300 hover:text-white"
                >
                  {translations?.navigation?.articles || "Articles"}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white"
                >
                  {translations?.navigation?.contact || "Contact"}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {translations?.footer?.followUs || "Follow Us"}
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/swiss_bjj_events/"
                className="text-gray-300 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-300">
            © {currentYear} Swiss BJJ.{" "}
            {translations?.footer?.rights || "All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
