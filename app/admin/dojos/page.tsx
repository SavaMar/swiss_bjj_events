"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../../lib/supabase";
import { Dojo } from "../../types/dojo";
import { SWISS_CANTON_NAMES } from "../../types/new-event";
import { Search, MapPin, Globe, Instagram, Users, Star } from "lucide-react";
import Image from "next/image";

export default function DojosPage() {
  const [dojos, setDojos] = useState<Dojo[]>([]);
  const [filteredDojos, setFilteredDojos] = useState<Dojo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCanton, setSelectedCanton] = useState<string>("all");

  // Helper function to validate and construct logo URL
  const getLogoUrl = (logo: string): string | null => {
    if (!logo) return null;

    try {
      // If it's already a full URL, return as is
      if (logo.startsWith("http")) {
        new URL(logo); // This will throw if invalid
        return logo;
      }

      // If it's a filename, construct the full URL
      const baseUrl = "https://filedn.com/lPmOLyYLDG0bQGSveFAL3WB/bjj%20logos/";
      const fullUrl = `${baseUrl}${logo}`;
      new URL(fullUrl); // This will throw if invalid
      return fullUrl;
    } catch {
      return null; // Return null for invalid URLs
    }
  };

  useEffect(() => {
    fetchDojos();
  }, []);

  useEffect(() => {
    filterDojos();
  }, [dojos, searchTerm, selectedCanton]);

  async function fetchDojos() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("Dojos")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        throw error;
      }

      setDojos(data || []);
    } catch (err) {
      console.error("Error fetching dojos:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch dojos");
    } finally {
      setLoading(false);
    }
  }

  const filterDojos = useCallback(() => {
    let filtered = dojos;

    // Filter by search term (name)
    if (searchTerm) {
      filtered = filtered.filter((dojo) =>
        dojo.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by canton
    if (selectedCanton !== "all") {
      filtered = filtered.filter((dojo) => dojo.kanton === selectedCanton);
    }

    setFilteredDojos(filtered);
  }, [dojos, searchTerm, selectedCanton]);

  // Get unique cantons for filter dropdown
  const uniqueCantons = Array.from(
    new Set(dojos.map((dojo) => dojo.kanton))
  ).sort();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dojos Management</h1>
        <div className="text-sm text-gray-500">
          {filteredDojos.length} of {dojos.length} dojos
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search by name */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Search by Name
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                id="search"
                placeholder="Enter dojo name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filter by canton */}
          <div>
            <label
              htmlFor="canton"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Filter by Canton
            </label>
            <select
              id="canton"
              value={selectedCanton}
              onChange={(e) => setSelectedCanton(e.target.value)}
              className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Cantons</option>
              {uniqueCantons.map((canton) => (
                <option key={canton} value={canton}>
                  {
                    SWISS_CANTON_NAMES[
                      canton as keyof typeof SWISS_CANTON_NAMES
                    ]
                  }{" "}
                  ({canton})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Dojos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDojos.map((dojo) => (
          <div
            key={dojo.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Dojo Header with Logo */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-start space-x-3">
                {/* Logo */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    {(() => {
                      const logoUrl = getLogoUrl(dojo.logo);
                      return logoUrl ? (
                        <Image
                          src={logoUrl}
                          alt={dojo.name}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full flex items-center justify-center text-gray-400">
                                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
                                  </svg>
                                </div>
                              `;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Dojo Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {dojo.name}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">
                      {dojo.address}, {dojo.zip_code}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {
                      SWISS_CANTON_NAMES[
                        dojo.kanton as keyof typeof SWISS_CANTON_NAMES
                      ]
                    }{" "}
                    ({dojo.kanton})
                  </div>
                </div>
              </div>
            </div>

            {/* Dojo Features */}
            <div className="p-4">
              <div className="space-y-3">
                {/* Contact Information */}
                <div className="space-y-1">
                  {dojo.website && (
                    <div className="flex items-center text-xs">
                      <Globe className="h-3 w-3 mr-2 text-blue-500 flex-shrink-0" />
                      <a
                        href={dojo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline truncate"
                      >
                        Website
                      </a>
                    </div>
                  )}
                  {dojo.instagram && (
                    <div className="flex items-center text-xs">
                      <Instagram className="h-3 w-3 mr-2 text-pink-500 flex-shrink-0" />
                      <a
                        href={dojo.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:text-pink-800 hover:underline truncate"
                      >
                        Instagram
                      </a>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1">
                  {dojo.is_womans && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                      <Users className="h-3 w-3 mr-1" />
                      Women&apos;s
                    </span>
                  )}
                  {dojo.is_kids && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      <Star className="h-3 w-3 mr-1" />
                      Kids
                    </span>
                  )}
                  {dojo.is_advanced && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Advanced
                    </span>
                  )}
                  {dojo.is_open_mat && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Open Mat
                    </span>
                  )}
                  {dojo.free_guest && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Free Guest
                    </span>
                  )}
                </div>

                {/* Trial Information */}
                {dojo.trial && (
                  <div className="text-xs text-gray-600">
                    <strong>Trial:</strong> {dojo.trial}
                  </div>
                )}

                {/* Extra Information */}
                {dojo.extra && (
                  <div className="text-xs text-gray-600">
                    <strong>Extra:</strong>{" "}
                    {Array.isArray(dojo.extra)
                      ? dojo.extra.join(", ")
                      : dojo.extra}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No results */}
      {filteredDojos.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No dojos found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}
