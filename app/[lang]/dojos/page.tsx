"use client";

import React, { useState, useEffect } from "react";
import DojoCard from "../../components/DojoCard";
import { Dojo, DOJO_FEATURE_COLORS } from "../../types/dojo";
import { SWISS_CANTON_NAMES, SwissCanton } from "../../types/event";
import { supabase } from "../../../lib/supabase";
import { useLanguage } from "../../context/LanguageContext";
import { Info } from "lucide-react";

export default function DojosPage() {
  const [dojos, setDojos] = useState<Dojo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { translations, language } = useLanguage();

  // Filters
  const [selectedCanton, setSelectedCanton] = useState<SwissCanton | "all">(
    "all"
  );
  const [selectedZipCode, setSelectedZipCode] = useState<string>("all");
  const [showWomans, setShowWomans] = useState<boolean | null>(null);
  const [showKids, setShowKids] = useState<boolean | null>(null);
  const [showAdvanced, setShowAdvanced] = useState<boolean | null>(null);
  const [showOpenMat, setShowOpenMat] = useState<boolean | null>(null);
  const [showFreeGuest, setShowFreeGuest] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchDojos() {
      try {
        setLoading(true);
        // Fetch from Supabase
        const { data, error } = await supabase
          .from("Dojos")
          .select("*")
          .order("name");

        if (error) {
          console.error("Error fetching from Supabase:", error);
          setError(`Failed to fetch dojos: ${error.message}`);
          setDojos([]);
        } else {
          setDojos(data || []);
        }
      } catch (err) {
        console.error("Error fetching dojos:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch dojos");
        setDojos([]);
      } finally {
        setLoading(false);
      }
    }

    fetchDojos();
  }, []);

  // Reset zip code filter when canton changes
  useEffect(() => {
    setSelectedZipCode("all");
  }, [selectedCanton]);

  // Get unique cantons from dojos
  const uniqueCantons = Array.from(
    new Set(dojos.map((dojo) => dojo.kanton))
  ).sort((a, b) => {
    const nameA = SWISS_CANTON_NAMES[a as SwissCanton] || a;
    const nameB = SWISS_CANTON_NAMES[b as SwissCanton] || b;
    return nameA.localeCompare(
      nameB,
      language === "fr" ? "fr" : language === "it" ? "it" : "de"
    );
  });

  // Get unique zip codes for the selected canton
  const zipCodesForCanton =
    selectedCanton === "all"
      ? []
      : Array.from(
          new Set(
            dojos
              .filter((dojo) => dojo.kanton === selectedCanton)
              .map((dojo) => dojo.zip_code)
          )
        ).sort();

  // Apply all filters to the dojos list
  const filteredDojos = dojos.filter((dojo) => {
    // Canton filter
    if (selectedCanton !== "all" && dojo.kanton !== selectedCanton) {
      return false;
    }

    // Zip code filter (only applies if a canton is selected)
    if (
      selectedZipCode !== "all" &&
      String(dojo.zip_code) !== String(selectedZipCode)
    ) {
      return false;
    }

    // Boolean filters - only filter if explicitly set to true or false
    if (showWomans !== null && dojo.is_womans !== showWomans) return false;
    if (showKids !== null && dojo.is_kids !== showKids) return false;
    if (showAdvanced !== null && dojo.is_advanced !== showAdvanced)
      return false;
    if (showOpenMat !== null && dojo.is_open_mat !== showOpenMat) return false;
    if (showFreeGuest !== null && dojo.free_guest !== showFreeGuest)
      return false;

    return true;
  });

  // Toggle filters helper function
  const toggleFilter = (
    value: boolean | null,
    setter: React.Dispatch<React.SetStateAction<boolean | null>>
  ) => {
    // Simplified toggle: null (don't filter) -> true (show only true) -> null (reset)
    // Removed the "false" state since users rarely want to filter for "without feature"
    if (value === null) setter(true);
    else setter(null);
  };

  // Button style helper
  const getButtonStyle = (value: boolean | null) => {
    if (value === null) return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    return "bg-green-600 text-white"; // Only true state remains
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
      <div className="container mx-auto px-4 py-8">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {translations?.dojos?.title || "Swiss BJJ Dojos"}
      </h1>

      {/* Features explanation */}
      <div className="mb-8 bg-gray-100 rounded-lg p-4 shadow-sm">
        <div className="flex items-center mb-2">
          <Info className="mr-2 text-gray-700" size={20} />
          <h2 className="text-lg font-semibold text-gray-800">
            {translations?.dojos?.explanation?.title ||
              "Gym Features Explained"}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex items-center">
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                DOJO_FEATURE_COLORS.womans.split(" ")[0]
              }`}
            ></span>
            <span className="text-sm">
              {translations?.dojos?.explanation?.womans ||
                "Women's Classes - Classes exclusively for women"}
            </span>
          </div>
          <div className="flex items-center">
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                DOJO_FEATURE_COLORS.kids.split(" ")[0]
              }`}
            ></span>
            <span className="text-sm">
              {translations?.dojos?.explanation?.kids ||
                "Kids Classes - The gym provides classes for children"}
            </span>
          </div>
          <div className="flex items-center">
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                DOJO_FEATURE_COLORS.advanced.split(" ")[0]
              }`}
            ></span>
            <span className="text-sm">
              {translations?.dojos?.explanation?.advanced ||
                "Advanced Training - Classes for higher colored belts"}
            </span>
          </div>
          <div className="flex items-center">
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                DOJO_FEATURE_COLORS.open_mat.split(" ")[0]
              }`}
            ></span>
            <span className="text-sm">
              {translations?.dojos?.explanation?.open_mat ||
                "Open Mat - Sessions for free rolling/training"}
            </span>
          </div>
          <div className="flex items-center">
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                DOJO_FEATURE_COLORS.free_guest.split(" ")[0]
              }`}
            ></span>
            <span className="text-sm">
              {translations?.dojos?.explanation?.free_guest ||
                "Free Guest Training - Visitors can drop in for free"}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-8 bg-blue-50 rounded-lg p-6 shadow-sm text-center">
        <h2 className="text-xl font-bold text-blue-800 mb-3">
          {/* @ts-expect-error - Translation key to be added later */}
          {translations?.dojos?.addGymTitle || "Add Your BJJ Gym"}
        </h2>
        <p className="text-blue-700 mb-4 max-w-2xl mx-auto">
          {/* @ts-expect-error - Translation key to be added later */}
          {translations?.dojos?.addGymDescription ||
            "Are you a gym owner or instructor? Get your dojo listed here. You can help me and also invite other gyms to join the community."}
        </p>
        <a
          href="https://forms.gle/9B1LRzgfV3Y2UaH17"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-300"
        >
          {/* @ts-expect-error - Translation key to be added later */}
          {translations?.dojos?.addGymButton || "Submit Your Gym"}
        </a>
      </div>

      {/* Filters section */}
      <div className="mb-8 space-y-4">
        {/* Location filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Canton filter */}
          <div>
            <label
              htmlFor="canton-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {translations?.dojos?.filter?.byCantonLabel ||
                "Filter by Canton:"}
            </label>
            <select
              id="canton-filter"
              value={selectedCanton}
              onChange={(e) =>
                setSelectedCanton(e.target.value as SwissCanton | "all")
              }
              className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">
                {translations?.dojos?.filter?.allCantons || "All Cantons"}
              </option>
              {uniqueCantons.map((canton) => (
                <option key={canton} value={canton}>
                  {SWISS_CANTON_NAMES[canton as SwissCanton] || canton} (
                  {canton})
                </option>
              ))}
            </select>
          </div>

          {/* ZIP code filter - only show if canton is selected */}
          {selectedCanton !== "all" && zipCodesForCanton.length > 0 && (
            <div>
              <label
                htmlFor="zip-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {translations?.dojos?.filter?.byZipCodeLabel ||
                  "Filter by ZIP Code:"}
              </label>
              <select
                id="zip-filter"
                value={selectedZipCode}
                onChange={(e) => setSelectedZipCode(e.target.value)}
                className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">
                  {translations?.dojos?.filter?.allZipCodes || "All ZIP Codes"}
                </option>
                {zipCodesForCanton.map((zip) => (
                  <option key={zip} value={zip}>
                    {zip}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Feature filters */}
        <div>
          <p className="block text-sm font-medium text-gray-700 mb-2">
            {translations?.dojos?.filter?.byFeaturesLabel ||
              "Filter by Features:"}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => toggleFilter(showWomans, setShowWomans)}
              className={`px-4 py-2 rounded-md ${getButtonStyle(showWomans)}`}
            >
              {translations?.dojos?.features?.womans || "Women's Classes"}{" "}
              {showWomans === true && "✓"}
            </button>
            <button
              onClick={() => toggleFilter(showKids, setShowKids)}
              className={`px-4 py-2 rounded-md ${getButtonStyle(showKids)}`}
            >
              {translations?.dojos?.features?.kids || "Kids Classes"}{" "}
              {showKids === true && "✓"}
            </button>
            <button
              onClick={() => toggleFilter(showAdvanced, setShowAdvanced)}
              className={`px-4 py-2 rounded-md ${getButtonStyle(showAdvanced)}`}
            >
              {translations?.dojos?.features?.advanced || "Advanced Training"}{" "}
              {showAdvanced === true && "✓"}
            </button>
            <button
              onClick={() => toggleFilter(showOpenMat, setShowOpenMat)}
              className={`px-4 py-2 rounded-md ${getButtonStyle(showOpenMat)}`}
            >
              {translations?.dojos?.features?.open_mat || "Open Mat"}{" "}
              {showOpenMat === true && "✓"}
            </button>
            <button
              onClick={() => toggleFilter(showFreeGuest, setShowFreeGuest)}
              className={`px-4 py-2 rounded-md ${getButtonStyle(
                showFreeGuest
              )}`}
            >
              {translations?.dojos?.features?.free_guest ||
                "Free Guest Training"}{" "}
              {showFreeGuest === true && "✓"}
            </button>
          </div>
        </div>

        {/* Clear filters button */}
        <div>
          <button
            onClick={() => {
              setSelectedCanton("all");
              setSelectedZipCode("all");
              setShowWomans(null);
              setShowKids(null);
              setShowAdvanced(null);
              setShowOpenMat(null);
              setShowFreeGuest(null);
            }}
            className="px-4 py-2 text-sm bg-gray-800 text-white rounded-md hover:bg-gray-700"
          >
            {translations?.dojos?.filter?.clearFilters || "Clear All Filters"}
          </button>
        </div>
      </div>

      {/* Dojos grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDojos.map((dojo) => (
          <DojoCard key={dojo.id} dojo={dojo} />
        ))}
      </div>

      {filteredDojos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {translations?.dojos?.noDojos ||
              "No dojos found matching your filters"}
          </p>
        </div>
      )}
    </div>
  );
}
