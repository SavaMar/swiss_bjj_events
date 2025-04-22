"use client";

import {
  Event,
  EVENT_TYPE_COLORS,
  SWISS_CANTON_NAMES,
  SwissCanton,
  EventType,
} from "../types/event";
import { useLanguage } from "../context/LanguageContext";
import { format, parseISO, parse, isValid } from "date-fns";
import { de, fr, it } from "date-fns/locale";

interface EventCardProps {
  event: Event;
  isPast?: boolean;
}

const locales = {
  en: undefined,
  de: de,
  fr: fr,
  it: it,
};

// Map event types to border color classes
const EVENT_BORDER_COLORS: Record<EventType, string> = {
  competition: "border-red-500",
  "open-mat": "border-green-500",
  womens: "border-pink-500",
  seminar: "border-cyan-500",
  kids: "border-amber-500",
  camp: "border-teal-500",
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

const EventCard = ({ event, isPast = false }: EventCardProps) => {
  const { language, translations } = useLanguage();

  // Normalize the event type
  const normalizedType = normalizeEventType(event.type);

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

  const startDate = parseDate(event.startDate);
  const endDate = parseDate(event.endDate);

  // Helper function to safely format dates with the correct locale
  const safeFormatDate = (date: Date, formatString: string) => {
    try {
      return format(date, formatString, {
        locale: locales[language as keyof typeof locales],
      });
    } catch (error) {
      console.error(`Error formatting date`, error);
      return "Invalid date";
    }
  };

  const dateDisplay =
    event.startDate === event.endDate
      ? safeFormatDate(startDate, "MMMM d, yyyy")
      : `${safeFormatDate(startDate, "MMMM d")} - ${safeFormatDate(
          endDate,
          "d, yyyy"
        )}`;

  const formatDate = (date: string) => {
    return safeFormatDate(parseDate(date), "dd.MM.yyyy");
  };

  // Safely get canton name or fallback to the canton code
  const cantonName =
    event.canton in SWISS_CANTON_NAMES
      ? SWISS_CANTON_NAMES[event.canton as SwissCanton]
      : event.canton;

  // Get the border color for this event type with a fallback
  const borderColorClass =
    EVENT_BORDER_COLORS[normalizedType] || "border-gray-300";

  // Get the badge color for this event type with a fallback
  const badgeColorClass =
    EVENT_TYPE_COLORS[normalizedType] || "bg-gray-100 text-gray-800";

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col ${
        isPast ? "opacity-70" : "hover:shadow-lg transition-shadow"
      } border-t-[7px] ${borderColorClass}`}
    >
      <div className="p-4 flex-grow flex flex-col">
        {/* Header */}
        <div className="flex flex-col mb-3 xl:mb-2">
          <div className="flex justify-between items-start mb-2">
            <h3
              className="text-lg font-bold text-gray-900 line-clamp-2"
              title={event.name}
            >
              {event.name}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ml-2 flex-shrink-0 ${badgeColorClass}`}
            >
              {translations?.events?.filter?.[normalizedType] || normalizedType}
            </span>
          </div>
          {/* Organizer */}
          <div className="text-sm text-gray-600 mb-2 italic">
            {translations?.events?.card?.organizer || "Organized by"}:{" "}
            <a
              href={event.organizerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600"
            >
              {event.organizer}
            </a>
          </div>

          {/* Past event badge */}
          {isPast && (
            <div className="bg-gray-100 py-1 px-2 rounded text-center">
              <span className="text-gray-600 font-semibold uppercase text-xs tracking-wider">
                Past Event
              </span>
            </div>
          )}
        </div>

        {/* Content - grows to fill space */}
        <div className="space-y-2 text-gray-600 flex-grow mb-4 text-sm">
          <p className="flex items-center">
            <span className="font-medium w-20 flex-shrink-0 xl:w-16">
              {translations?.events?.card?.date}:
            </span>
            <span className="truncate">{dateDisplay}</span>
          </p>

          <p className="flex items-center">
            <span className="font-medium w-20 flex-shrink-0 xl:w-16">
              Time:
            </span>
            <span>
              {event.startTime} - {event.endTime}
            </span>
          </p>

          {/* Guest information - only for seminar events */}
          {normalizedType === "seminar" && event.guest_name && (
            <p className="flex items-center">
              <span className="font-medium w-20 flex-shrink-0 xl:w-16">
                {/* @ts-expect-error - Guest might not be in the translation type yet */}
                {translations?.events?.card?.guest || "Guest"}:
              </span>
              {event.guest_link ? (
                <a
                  href={event.guest_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {event.guest_name}
                </a>
              ) : (
                <span>{event.guest_name}</span>
              )}
            </p>
          )}

          <p className="flex items-center">
            <span className="font-medium w-20 flex-shrink-0 xl:w-16">
              {translations?.events?.card?.registerUntil}:
            </span>
            <span>{formatDate(event.registerUntil)}</span>
          </p>

          <p className="flex items-start">
            <span className="font-medium w-20 flex-shrink-0 xl:w-16">
              {translations?.events?.card?.location}:
            </span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                event.address
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="line-clamp-2 text-blue-600 hover:text-blue-800 hover:underline"
              title={event.address}
            >
              {event.address}
            </a>
          </p>
        </div>
        {/* Footer - always at the bottom */}
        <div className="pt-3 border-t border-gray-100 mt-auto">
          <a
            href={event.eventLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full block text-center px-4 py-2 rounded-md transition-colors text-sm ${
              isPast
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            onClick={(e) => {
              if (isPast) {
                e.preventDefault();
              } else {
                window.open(event.eventLink, "_blank", "noopener,noreferrer");
              }
            }}
          >
            {isPast
              ? "Event Completed"
              : translations?.events?.card?.registerButton || "Register Now"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
