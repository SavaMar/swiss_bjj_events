"use client";

import { useState, useEffect } from "react";
import EventCard from "./components/EventCard";
import Link from "next/link";
import {
  Event,
  EventType,
  SwissCanton,
  SWISS_CANTON_NAMES,
} from "./types/event";
import { useLanguage } from "./context/LanguageContext";
import { parseISO, isValid, parse } from "date-fns";
import { supabase } from "../lib/supabase";

type FilterType = EventType | "all";

// Bilingual canton names for commonly used cantons
const BILINGUAL_CANTON_NAMES: Partial<
  Record<SwissCanton, { de: string; fr: string }>
> = {
  BE: { de: "Bern", fr: "Berne" },
  FR: { de: "Freiburg", fr: "Fribourg" },
  VS: { de: "Wallis", fr: "Valais" },
  GR: { de: "Graubünden", fr: "Grisons" },
};

// Normalize event type to handle case differences and other potential inconsistencies
const normalizeEventType = (type: string): EventType => {
  // Convert to lowercase and trim any whitespace
  const normalized = type.toLowerCase().trim();

  // Map to valid EventType values
  switch (normalized) {
    case "competition":
      return "competition";
    case "open-mat":
    case "openmat":
    case "open mat":
      return "open-mat";
    case "womens":
    case "women's":
    case "women":
      return "womens";
    case "seminar":
    case "seminars":
      return "seminar";
    case "kids":
    case "kid":
    case "children":
      return "kids";
    case "camp":
    case "training camp":
    case "trainingcamp":
      return "camp";
    default:
      console.warn(
        `Unknown event type: ${type}. Using "competition" as fallback.`
      );
      return "competition"; // Default fallback
  }
};

// Helper function to parse date strings in various formats
const parseDate = (dateStr: string) => {
  try {
    // Try ISO format first (YYYY-MM-DD)
    let date = parseISO(dateStr);
    if (isValid(date)) return date;

    // Try day.month.year format (DD.MM.YYYY)
    date = parse(dateStr, "dd.MM.yyyy", new Date());
    if (isValid(date)) return date;

    // Try other formats if needed
    date = parse(dateStr, "d.M.yyyy", new Date());
    if (isValid(date)) return date;

    // If all fails, return current date and log an error
    console.error(`Could not parse date: ${dateStr}`);
    return new Date();
  } catch (error) {
    console.error(`Error parsing date: ${dateStr}`, error);
    return new Date();
  }
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<FilterType>("all");
  const [selectedCanton, setSelectedCanton] = useState<SwissCanton | "all">(
    "all"
  );
  const [includePastEvents, setIncludePastEvents] = useState(false);
  const { translations, language } = useLanguage();

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("Event")
          .select("*")
          .order("startDate", { ascending: true });

        if (error) {
          throw error;
        }

        setEvents(data || []);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Get unique cantons from events for the dropdown
  const usedCantons = Array.from(
    new Set(events.map((event) => event.canton as SwissCanton))
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

  // Helper function to safely check if a date is today or in the future
  const isCurrentOrFutureDate = (dateStr: string) => {
    try {
      const date = parseDate(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to beginning of day for comparison
      return isValid(date) && date >= today;
    } catch {
      return true; // If we can't parse the date, include it by default
    }
  };

  // Helper function to safely check if a date is in the past
  const isDateInPast = (dateStr: string) => {
    try {
      const date = parseDate(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to beginning of day for comparison
      return isValid(date) && date < today;
    } catch {
      return false;
    }
  };

  const filteredEvents = events
    .filter((event) => {
      // Type filtering
      if (selectedType === "all") return true;
      // Normalize the event type for consistent filtering
      return normalizeEventType(event.type) === selectedType;
    })
    .filter((event) => {
      // Canton filtering
      if (selectedCanton === "all") return true;
      return event.canton === selectedCanton;
    })
    .filter((event) => {
      // Show only current/future events unless includePastEvents is true
      if (!includePastEvents) {
        return isCurrentOrFutureDate(event.startDate);
      }
      // If includePastEvents is true, show all events
      return true;
    })
    .sort((a, b) => {
      try {
        const dateA = parseDate(a.startDate);
        const dateB = parseDate(b.startDate);
        if (isValid(dateA) && isValid(dateB)) {
          return dateA.getTime() - dateB.getTime();
        }
        return 0;
      } catch {
        return 0;
      }
    });

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{translations?.events?.title}</h1>
        <Link
          href="/calendar"
          className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          aria-label="View calendar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span className="sm:inline">
            {translations?.events?.calendarView || "Calendar View"}
          </span>
        </Link>
      </div>

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
        {(
          [
            "womens",
            "open-mat",
            "competition",
            "seminar",
            "kids",
            "camp",
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

        {/* Calendar view button - desktop only */}
        <a
          href="/calendar"
          className="hidden md:flex px-4 py-2 rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200 items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {translations?.events?.calendarView || "Calendar View"}
        </a>

        {/* Toggle for past events */}
        <button
          onClick={() => setIncludePastEvents(!includePastEvents)}
          className={`px-4 py-2 rounded-md ml-auto ${
            includePastEvents
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          {includePastEvents ? "Hide Past Events" : "Show Past Events"}
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
            isPast={isDateInPast(event.startDate)}
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
