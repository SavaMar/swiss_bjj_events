"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import { Event } from "../types/event";
import { useLanguage } from "../context/LanguageContext";
import { format, parseISO, isValid, parse } from "date-fns";
import { ChevronLeft } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function CalendarView() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [dayEvents, setDayEvents] = useState<Event[]>([]);
  const { translations } = useLanguage();

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
  const isEventOnDate = (event: Event, date: Date) => {
    const eventStartDate = parseDate(event.startDate);

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

  // Fetch events from Supabase
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
        <h1 className="text-3xl font-bold ml-4">
          {translations?.events?.calendarView || "Calendar View"}
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <Calendar
            mode="single"
            selected={selectedDay}
            onSelect={handleDaySelect}
            today={new Date()}
            className="border rounded-md p-4 w-full"
            classNames={{
              day_today: "bg-blue-100 text-blue-800 font-bold",
              months: "w-full",
              month: "w-full",
              table: "w-full border-collapse space-y-1",
              cell: "p-0 relative",
              day: "w-9 h-9 p-0 font-normal mx-auto flex items-center justify-center",
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
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="bg-white p-4 rounded-md shadow-sm"
                      >
                        <h3 className="font-bold">{event.name}</h3>
                        <p className="text-sm text-gray-600">
                          {event.type} • {event.startTime} - {event.endTime}
                        </p>
                        <p className="text-sm text-gray-600">{event.address}</p>
                        <a
                          href={event.eventLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-blue-600 text-sm hover:underline"
                        >
                          {translations?.events?.card?.registerButton ||
                            "Register Now"}
                        </a>
                      </div>
                    ))}
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
