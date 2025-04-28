"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../../context/LanguageContext";
import { ExternalLink, Instagram, Book } from "lucide-react";

interface Organization {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
  instagramUrl?: string;
  rulesUrl: string;
}

// Mock data for organizations
const organizations: Organization[] = [
  {
    // https://ajptour.com/en/regulations/competition-rules/ajp-jiu-jitsu-rules
    // file:///Users/marisava/Downloads/rule-book.pdf
    // file:///Users/marisava/Downloads/rules-update-guide.pdf

    id: "ajp",
    name: "AJP (Abu Dhabi Jiu-Jitsu Pro)",
    description:
      "A global professional jiu-jitsu organization founded by the UAE Jiu-Jitsu Federation. Known for organizing major tournaments like the Abu Dhabi World Professional Championship.",
    logoUrl: "https://filedn.com/lPmOLyYLDG0bQGSveFAL3WB/bjj%20logos/ajp.png",
    websiteUrl: "https://ajptour.com/",
    instagramUrl: "https://www.instagram.com/ajp_switzerland",
    rulesUrl: "/organisations/ajp/rules",
  },
  {
    // https://adcombat.com/adcc-rules-regulations/
    // https://adcombat.com/adcc-rules-regulations/adcc-rules-for-beginners-intermediate/
    id: "adcc",
    name: "ADCC (Abu Dhabi Combat Club)",
    description:
      "The most prestigious submission wrestling competition in the world. ADCC hosts the World Championships every two years, attracting the elite of grappling.",
    logoUrl: "https://filedn.com/lPmOLyYLDG0bQGSveFAL3WB/bjj%20logos/adcc.png",
    websiteUrl: "https://adcombat.com/",
    instagramUrl: "https://www.instagram.com/adccsuisse/",
    rulesUrl: "/organisations/adcc/rules",
  },
  {
    // AJP RULES
    id: "sbjjnf",
    name: "SBJJNF (Swiss Brazilian Jiu-Jitsu National Federation)",
    description:
      "The national federation governing Brazilian Jiu-Jitsu in Switzerland, organizing tournaments and promoting the sport throughout the country.",
    logoUrl:
      "https://filedn.com/lPmOLyYLDG0bQGSveFAL3WB/bjj%20logos/sbjjnf.png",
    websiteUrl: "https://www.instagram.com/sbjjnf/",
    instagramUrl: "https://www.instagram.com/sbjjnf/",
    rulesUrl: "/organisations/sbjjnf/rules",
  },
  {
    // https://grapplingindustries.com/rules/
    id: "grapplingindustries",
    name: "Grappling Industries",
    description:
      "An international tournament series with a unique round-robin format. Known for their well-organized events across Europe, North America, and Australia.",
    logoUrl: "https://filedn.com/lPmOLyYLDG0bQGSveFAL3WB/bjj%20logos/gp.png",
    websiteUrl: "https://grapplingindustries.com/",
    instagramUrl: "https://www.instagram.com/grapplingindustries/",
    rulesUrl: "/organisations/grapplingindustries/rules",
  },
];

export default function OrganisationsPage() {
  const { translations } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">
        {translations?.organisations?.title ||
          "BJJ Organizations in Switzerland"}
      </h1>

      <p className="text-lg mb-8">
        {translations?.organisations?.description ||
          "Here you can find information about major BJJ organizations active in Switzerland. These organizations host competitions and events throughout the country and internationally."}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {organizations.map((org) => (
          <div
            key={org.id}
            className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col"
          >
            <div className="relative h-48 bg-gray-100 flex items-center justify-center p-4">
              <Image
                src={org.logoUrl}
                alt={org.name}
                fill
                className="object-contain p-4"
              />
            </div>

            <div className="p-6 flex-grow">
              <h2 className="text-xl font-bold mb-2">{org.name}</h2>
              <p className="text-gray-600 mb-4">
                {(org.id === "ajp" &&
                  translations?.organisations?.ajp?.description) ||
                  (org.id === "adcc" &&
                    translations?.organisations?.adcc?.description) ||
                  (org.id === "sbjjnf" &&
                    translations?.organisations?.sbjjnf?.description) ||
                  (org.id === "grapplingindustries" &&
                    translations?.organisations?.grapplingindustries
                      ?.description) ||
                  org.description}
              </p>

              <div className="space-y-3 mt-auto">
                <a
                  href={org.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink size={16} className="mr-2" />
                  {translations?.organisations?.visitWebsite ||
                    "Visit Official Website"}
                </a>

                {org.instagramUrl && (
                  <a
                    href={org.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-pink-600 hover:text-pink-800"
                  >
                    <Instagram size={16} className="mr-2" />
                    {translations?.organisations?.followInstagram ||
                      "Follow on Instagram"}
                  </a>
                )}

                <Link
                  href={org.rulesUrl}
                  className="flex items-center text-green-600 hover:text-green-800"
                >
                  <Book size={16} className="mr-2" />
                  {translations?.organisations?.viewRules ||
                    "View Competition Rules"}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
