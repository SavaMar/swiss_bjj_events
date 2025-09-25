"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import { NewEvent, NewEventType } from "../../types/new-event";
import { useLanguage } from "../../context/LanguageContext";
import { format, parseISO, isValid, parse } from "date-fns";
import { ChevronLeft } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import Image from "next/image";

// Event type colors mapping
const EVENT_TYPE_COLORS: Record<NewEventType, string> = {
  competition: "bg-red-100 text-red-800",
  "open-mat": "bg-green-100 text-green-800",
  womens: "bg-pink-100 text-pink-800",
  seminar: "bg-cyan-100 text-cyan-800",
  kids: "bg-amber-100 text-amber-500",
  camp: "bg-purple-100 text-purple-800",
};

export default function CalendarView() {
  const [events, setEvents] = useState<NewEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [dayEvents, setDayEvents] = useState<NewEvent[]>([]);
  const { translations } = useLanguage();

  // Base URL for all dojo logos
  const logoBaseUrl = "https://filedn.com/lPmOLyYLDG0bQGSveFAL3WB/bjj%20logos/";

  // Construct the full logo URL
  const getLogoUrl = (filename: string): string => {
    if (!filename) return "";
    // If it's already a full URL, return as is
    if (filename.startsWith("http")) return filename;
    // Otherwise append to the base URL
    return `${logoBaseUrl}${filename}`;
  };

  // Normalize event type to handle case differences
  const normalizeEventType = (type: string): NewEventType => {
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

  // Function to check if an event is on a specific date
  const isEventOnDate = (event: NewEvent, date: Date) => {
    const eventStartDate = parseDate(event.startdate);

    return (
      date.getDate() === eventStartDate.getDate() &&
      date.getMonth() === eventStartDate.getMonth() &&
      date.getFullYear() === eventStartDate.getFullYear()
    );
  };

  // Function to handle day selection
  const handleDaySelect = (day: Date | undefined) => {
    setSelectedDay(day);
    if (day) {
      const eventsOnDay = events.filter((event) => isEventOnDate(event, day));
      setDayEvents(eventsOnDay);
    } else {
      setDayEvents([]);
    }
  };

  // Helper function to check if a date is in the past
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

  // Fetch events from Supabase
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("startdate", { ascending: true });

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

  // Function to render day contents - add dot if event is on that day
  const renderDayContents = (props: { date: Date }) => {
    const hasEvent = events.some((event) => isEventOnDate(event, props.date));

    return (
      <div className="relative flex items-center justify-center w-full h-full">
        <span>{props.date.getDate()}</span>
        {hasEvent && (
          <div
            className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full"
            aria-hidden="true"
          ></div>
        )}
      </div>
    );
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
      <div className="flex items-center mb-6">
        <Link href="/" className="text-blue-600 flex items-center">
          <ChevronLeft size={20} />
          <span>{translations?.events?.backToEvents || "Back to Events"}</span>
        </Link>
        <h1 className="text-3xl font-bold ml-4"></h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <Calendar
            mode="single"
            selected={selectedDay}
            onSelect={handleDaySelect}
            today={new Date()}
            className="border rounded-md p-4 w-full mx-auto"
            weekStartsOn={1}
            classNames={{
              day_today: "bg-blue-100 text-blue-800 font-bold",
              months: "w-full",
              month: "w-full space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label:
                "text-sm md:text-base lg:text-lg font-medium text-center flex-1",
              nav: "space-x-1 flex items-center",
              nav_button:
                "h-7 w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center",
              table: "w-full border-collapse",
              head_row: "flex w-full justify-between",
              head_cell:
                "text-gray-500 w-9 md:w-10 lg:w-12 font-normal text-[0.8rem] md:text-sm lg:text-base flex items-center justify-center",
              row: "flex w-full justify-between mt-2",
              cell: "h-9 w-9 md:h-10 md:w-10 lg:h-12 lg:w-12 text-center text-sm md:text-base p-0 relative [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 md:h-10 md:w-10 lg:h-12 lg:w-12 p-0 font-normal md:font-medium text-sm md:text-base lg:text-lg flex items-center justify-center",
              day_range_end: "day-range-end",
              day_selected:
                "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white rounded-md",
              day_outside: "text-gray-300",
              day_disabled: "text-gray-300",
              day_hidden: "invisible",
            }}
            components={{
              DayContent: renderDayContents,
            }}
            fixedWeeks={true}
            showOutsideDays={true}
          />
        </div>

        <div className="w-full md:w-1/2">
          <div className="bg-gray-50 p-4 rounded-md h-full">
            {selectedDay ? (
              <>
                <h2 className="text-xl font-bold mb-4">
                  {format(selectedDay, "MMMM d, yyyy")}
                </h2>
                {dayEvents.length > 0 ? (
                  <div className="space-y-4">
                    {dayEvents.map((event) => {
                      const isPast = isDateInPast(event.startdate);
                      const normalizedType = normalizeEventType(event.type);
                      const typeColorClass =
                        EVENT_TYPE_COLORS[normalizedType] ||
                        "bg-gray-100 text-gray-800";
                      const logoUrl = event.event_img
                        ? getLogoUrl(event.event_img)
                        : "";

                      return (
                        <div
                          key={event.id}
                          className={`bg-white rounded-md shadow-sm border-l-4 ${
                            isPast ? "opacity-60" : ""
                          } flex overflow-hidden`}
                          style={{
                            borderLeftColor: typeColorClass.includes("text-")
                              ? typeColorClass
                                  .split("text-")[1]
                                  .split(" ")[0]
                                  .replace("red-800", "#ef4444")
                                  .replace("green-800", "#16a34a")
                                  .replace("pink-800", "#db2777")
                                  .replace("cyan-800", "#0891b2")
                                  .replace("amber-500", "#f59e0b")
                                  .replace("purple-800", "#9333ea")
                              : "#e5e7eb",
                          }}
                        >
                          {/* Logo Section - 25% width */}
                          <div className="w-1/4 min-w-[80px] bg-gray-50 relative">
                            {logoUrl ? (
                              <div className="relative w-full h-full min-h-[120px]">
                                <Image
                                  src={logoUrl}
                                  alt={event.organizer}
                                  fill
                                  sizes="150px"
                                  className="object-cover"
                                  onError={(e) => {
                                    // Hide the image on error and show fallback
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = "none";
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400 font-semibold text-lg">
                                BJJ
                              </div>
                            )}
                          </div>

                          {/* Information Section - 75% width */}
                          <div className="w-3/4 p-4">
                            <h3 className="font-bold text-gray-900">
                              {event.name}
                            </h3>

                            <div className="flex items-center gap-2 mt-1 mb-2">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${typeColorClass}`}
                              >
                                {translations?.events?.filter?.[
                                  normalizedType
                                ] || normalizedType}
                              </span>
                              <span className="text-xs text-gray-600">
                                {event.starttime} - {event.endtime}
                              </span>
                            </div>

                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                event.address
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-sm text-blue-600 hover:text-blue-800 underline mb-3"
                            >
                              {event.address}
                            </a>

                            {!isPast ? (
                              <a
                                href={event.eventlink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                              >
                                {translations?.events?.card?.registerButton ||
                                  "Register Now"}
                              </a>
                            ) : (
                              <span className="inline-block px-3 py-1 bg-gray-400 text-white text-sm rounded cursor-not-allowed">
                                Event Completed
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500">No events on this day</p>
                )}
              </>
            ) : (
              <p className="text-gray-500 flex items-center justify-center h-full">
                Select a day to view events
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
