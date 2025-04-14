"use client";

import { useState } from "react";
import EventCard from "./components/EventCard";
import { EventType, SwissCanton, SWISS_CANTON_NAMES } from "./types/event";
import { useLanguage } from "./context/LanguageContext";
import {
  startOfMonth,
  endOfMonth,
  isPast,
  isThisMonth,
  parseISO,
} from "date-fns";
import { mockEvents } from "./data/mockEvents";

type FilterType = EventType | "all" | "this-month";

// Bilingual canton names for commonly used cantons
const BILINGUAL_CANTON_NAMES: Partial<
  Record<SwissCanton, { de: string; fr: string }>
> = {
  BE: { de: "Bern", fr: "Berne" },
  FR: { de: "Freiburg", fr: "Fribourg" },
  VS: { de: "Wallis", fr: "Valais" },
  GR: { de: "Graubünden", fr: "Grisons" },
};

export default function Home() {
  const [selectedType, setSelectedType] = useState<FilterType>("all");
  const [selectedCanton, setSelectedCanton] = useState<SwissCanton | "all">(
    "all"
  );
  const [includePastEvents, setIncludePastEvents] = useState(true);
  const { translations, language } = useLanguage();

  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  // Get unique cantons from events for the dropdown
  const usedCantons = Array.from(
    new Set(mockEvents.map((event) => event.canton as SwissCanton))
  ).sort((a, b) => {
    const nameA = getCantonDisplayName(a);
    const nameB = getCantonDisplayName(b);
    return nameA.localeCompare(nameB, language === "fr" ? "fr" : "de");
  });

  // Helper function to get the canton display name
  function getCantonDisplayName(canton: SwissCanton): string {
    const bilingualName = BILINGUAL_CANTON_NAMES[canton];
    if (bilingualName) {
      return language === "fr" ? bilingualName.fr : bilingualName.de;
    }
    return SWISS_CANTON_NAMES[canton];
  }

  const filteredEvents = mockEvents
    .filter((event) => {
      // Type filtering
      if (selectedType === "all") return true;
      if (selectedType === "this-month") {
        const eventDate = parseISO(event.startDate);
        return eventDate >= monthStart && eventDate <= monthEnd;
      }
      return event.type === selectedType;
    })
    .filter((event) => {
      // Canton filtering
      if (selectedCanton === "all") return true;
      return event.canton === selectedCanton;
    })
    .filter((event) => {
      const eventDate = parseISO(event.startDate);
      const isPastEvent = isPast(eventDate);

      if (isPastEvent) {
        // For past events, only include them if:
        // 1. We want to include past events AND
        // 2. Event is from the current month OR we're not filtering by "this-month"
        return (
          includePastEvents &&
          (isThisMonth(eventDate) || selectedType !== "this-month")
        );
      }

      // Always include future events
      return true;
    })
    .sort(
      (a, b) =>
        parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">{translations?.events?.title}</h1>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setSelectedType("all")}
          className={`px-4 py-2 rounded-md ${
            selectedType === "all"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          {translations?.events?.filter?.all}
        </button>
        <button
          onClick={() => setSelectedType("this-month")}
          className={`px-4 py-2 rounded-md ${
            selectedType === "this-month"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          {translations?.events?.filter?.thisMonth || "This Month"}
        </button>
        {(
          [
            "womens",
            "open-mat",
            "competition",
            "seminar",
            "kids",
          ] as EventType[]
        ).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-md ${
              selectedType === type
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {translations?.events?.filter?.[type] ||
              type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
          </button>
        ))}

        {/* Toggle for past events */}
        <button
          onClick={() => setIncludePastEvents(!includePastEvents)}
          className={`px-4 py-2 rounded-md ml-auto ${
            includePastEvents
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          {includePastEvents
            ? translations?.events?.filter?.includingPastEvents ||
              "Including Past Events"
            : translations?.events?.filter?.hidePastEvents ||
              "Hide Past Events"}
        </button>
      </div>

      {/* Canton filter dropdown - only showing cantons with events */}
      {usedCantons.length > 0 && (
        <div className="mb-8">
          <label
            htmlFor="canton-filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {translations?.events?.filter?.byCantonLabel || "Filter by Canton:"}
          </label>
          <div className="relative">
            <select
              id="canton-filter"
              value={selectedCanton}
              onChange={(e) =>
                setSelectedCanton(e.target.value as SwissCanton | "all")
              }
              className="block w-full max-w-xs rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">
                {translations?.events?.filter?.allCantons || "All Cantons"}
              </option>
              {usedCantons.map((canton) => (
                <option key={canton} value={canton}>
                  {getCantonDisplayName(canton)} ({canton})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Events grid - updated to 4 columns on large screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isPast={isPast(parseISO(event.startDate))}
          />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">{translations?.events?.noEvents}</p>
        </div>
      )}
    </div>
  );
}
