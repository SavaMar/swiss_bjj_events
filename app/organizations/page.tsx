"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import { ExternalLink, Instagram } from "lucide-react";

interface Organization {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
  instagramUrl: string;
  rulesSlug: string;
}

const mockOrganizations: Organization[] = [
  {
    id: "ajp",
    name: "AJP",
    description:
      "Abu Dhabi Jiu-Jitsu Pro, formerly known as UAEJJF, organizes tournaments worldwide with a ranking system.",
    logoUrl: "/placeholder.jpg", // Replace with actual logo
    websiteUrl: "https://ajptour.com/",
    instagramUrl: "https://www.instagram.com/ajptour/",
    rulesSlug: "ajp-rules",
  },
  {
    id: "adcc",
    name: "ADCC",
    description:
      "Abu Dhabi Combat Club, the most prestigious no-gi grappling competition in the world.",
    logoUrl: "/placeholder.jpg", // Replace with actual logo
    websiteUrl: "https://adcombat.com/",
    instagramUrl: "https://www.instagram.com/adcc_official/",
    rulesSlug: "adcc-rules",
  },
  {
    id: "sbjjnf",
    name: "SBJJNF",
    description:
      "Swiss Brazilian Jiu-Jitsu & No-Gi Federation, the national federation for BJJ in Switzerland.",
    logoUrl: "/placeholder.jpg", // Replace with actual logo
    websiteUrl: "https://www.sbjjnf.ch/",
    instagramUrl: "https://www.instagram.com/sbjjnf/",
    rulesSlug: "sbjjnf-rules",
  },
  {
    id: "grappling-industries",
    name: "Grappling Industries",
    description:
      "Round robin tournament format with a minimum of 4-5 matches per competitor.",
    logoUrl: "/placeholder.jpg", // Replace with actual logo
    websiteUrl: "https://grapplingindustries.com/",
    instagramUrl: "https://www.instagram.com/grapplingindustries/",
    rulesSlug: "grappling-industries-rules",
  },
];

export default function OrganizationsPage() {
  const { translations, currentLanguage } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {translations?.organizations?.title || "Organizations"}
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
        {translations?.organizations?.description ||
          "Major Brazilian Jiu-Jitsu and grappling organizations that host competitions in Switzerland and internationally."}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockOrganizations.map((org) => (
          <div
            key={org.id}
            className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="relative w-16 h-16 mr-4">
                    <Image
                      src={org.logoUrl}
                      alt={org.name}
                      fill
                      sizes="64px"
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">{org.name}</h3>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{org.description}</p>

              <div className="flex flex-wrap gap-3">
                <a
                  href={org.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink size={16} className="mr-1" />
                  {translations?.organizations?.website || "Website"}
                </a>

                <a
                  href={org.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-pink-600 hover:text-pink-800"
                >
                  <Instagram size={16} className="mr-1" />
                  Instagram
                </a>

                <Link
                  href={`/organizations/rules/${org.rulesSlug}`}
                  className="flex items-center text-gray-700 hover:text-gray-900"
                >
                  {translations?.organizations?.rules || "Competition Rules"}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
