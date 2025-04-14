"use client";

import {
  Event,
  EVENT_TYPE_COLORS,
  SWISS_CANTON_NAMES,
  SwissCanton,
} from "../types/event";
import { useLanguage } from "../context/LanguageContext";
import { format, parseISO } from "date-fns";
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

// Extract the color values without the bg- and text- prefixes
const EVENT_BORDER_COLORS: Record<string, string> = {
  competition: "border-red-500",
  "open-mat": "border-green-500",
  womens: "border-pink-500",
  seminar: "border-cyan-500",
  kids: "border-amber-500",
};

const EventCard = ({ event, isPast = false }: EventCardProps) => {
  const { language, translations } = useLanguage();

  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);

  const dateDisplay =
    event.startDate === event.endDate
      ? format(startDate, "MMMM d, yyyy")
      : `${format(startDate, "MMMM d")} - ${format(endDate, "d, yyyy")}`;

  const formatDate = (date: string) => {
    return format(parseISO(date), "dd.MM.yyyy", {
      locale: locales[language as keyof typeof locales],
    });
  };

  // Safely get canton name or fallback to the canton code
  const cantonName =
    event.canton in SWISS_CANTON_NAMES
      ? SWISS_CANTON_NAMES[event.canton as SwissCanton]
      : event.canton;

  const borderColorClass = EVENT_BORDER_COLORS[event.type] || "border-gray-300";

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
              className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ml-2 flex-shrink-0 ${
                EVENT_TYPE_COLORS[event.type]
              }`}
            >
              {translations?.events?.filter?.[event.type] || event.type}
            </span>
          </div>

          {/* Organizer */}
          <div className="text-sm text-gray-600 mb-2 italic">
            {translations?.events?.card?.organizer || "Organized by"}:{" "}
            {event.organizer}
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

          <p className="flex items-center">
            <span className="font-medium w-20 flex-shrink-0 xl:w-16">
              {translations?.events?.card?.registerUntil}:
            </span>
            <span>{formatDate(event.registerUntil)}</span>
          </p>

          <p className="flex items-center">
            <span className="font-medium w-20 flex-shrink-0 xl:w-16">
              Canton:
            </span>
            <span>{cantonName}</span>
          </p>

          <p className="flex items-start">
            <span className="font-medium w-20 flex-shrink-0 xl:w-16">
              {translations?.events?.card?.location}:
            </span>
            <span className="line-clamp-2" title={event.address}>
              {event.address}
            </span>
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
            onClick={(e) => isPast && e.preventDefault()}
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
