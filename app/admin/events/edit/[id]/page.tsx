"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";
import { Event, SWISS_CANTON_NAMES } from "../../../../types/event";
import { Session } from "@supabase/supabase-js";
import { format, parse, parseISO, isValid } from "date-fns";

type PageProps = {
  params: {
    id: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
};

export default function EditEventPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [formData, setFormData] = useState<Omit<Event, "id">>({
    name: "",
    organizer: "",
    organizerUrl: "",
    registerUntil: "",
    eventLink: "",
    logoUrl: "",
    canton: "ZH",
    address: "",
    type: "competition",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });
  const [error, setError] = useState<string | null>(null);

  // Helper function to parse date strings in various formats
  const parseDate = useCallback((dateStr: string) => {
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

      console.error(`Could not parse date: ${dateStr}`);
      return null;
    } catch (error) {
      console.error(`Error parsing date: ${dateStr}`, error);
      return null;
    }
  }, []);

  // Helper function to convert a date string to YYYY-MM-DD format for input fields
  const formatDateForInput = useCallback(
    (dateStr: string) => {
      try {
        const date = parseDate(dateStr);
        if (!date) return "";
        return format(date, "yyyy-MM-dd");
      } catch (error) {
        console.error(`Error formatting date for input: ${dateStr}`, error);
        return "";
      }
    },
    [parseDate]
  );

  // Use useCallback to memoize the fetchEvent function
  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("Event")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("Event not found");
      }

      // Format the dates from the database to YYYY-MM-DD format for input fields
      setFormData({
        name: data.name,
        organizer: data.organizer,
        organizerUrl: data.organizerUrl || "",
        registerUntil: formatDateForInput(data.registerUntil),
        eventLink: data.eventLink,
        logoUrl: data.logoUrl || "",
        canton: data.canton,
        address: data.address,
        type: data.type,
        startDate: formatDateForInput(data.startDate),
        endDate: formatDateForInput(data.endDate),
        startTime: data.startTime,
        endTime: data.endTime,
      });
    } catch (err) {
      console.error("Error fetching event:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch event");
    } finally {
      setLoading(false);
    }
  }, [id, formatDateForInput]);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        // Redirect to admin login if no session
        router.push("/admin");
      } else {
        // Fetch event data
        fetchEvent();
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        // Redirect to admin login if no session
        router.push("/admin");
      }
    });

    return () => subscription.unsubscribe();
  }, [router, id, fetchEvent]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setUpdateLoading(true);

      // Make sure endDate is set if not provided
      const dataToSubmit = {
        ...formData,
        endDate: formData.endDate || formData.startDate,
      };

      const { error } = await supabase
        .from("Event")
        .update(dataToSubmit)
        .eq("id", id);

      if (error) {
        throw error;
      }

      alert("Event updated successfully!");
      router.push("/admin");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "An error occurred while updating the event"
      );
    } finally {
      setUpdateLoading(false);
    }
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
          <div className="mt-4">
            <button
              onClick={() => router.push("/admin")}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Back to Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Event</h1>
        <button
          onClick={() => router.push("/admin")}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Back to Admin
        </button>
      </div>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Event Name *
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              name="name"
              type="text"
              placeholder="Event Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="organizer"
            >
              Organizer *
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="organizer"
              name="organizer"
              type="text"
              placeholder="Organizer"
              value={formData.organizer}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="organizerUrl"
            >
              Organizer URL
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="organizerUrl"
              name="organizerUrl"
              type="url"
              placeholder="https://..."
              value={formData.organizerUrl}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="startDate"
              >
                Start Date *
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="endDate"
              >
                End Date
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                If not specified, will use start date
              </p>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="startTime"
              >
                Start Time *
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="endTime"
              >
                End Time *
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="type"
            >
              Event Type *
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="competition">Competition</option>
              <option value="womens">Women&apos;s</option>
              <option value="kids">Kids</option>
              <option value="open-mat">Open Mat</option>
              <option value="seminar">Seminar</option>
            </select>
          </div>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="canton"
              >
                Canton *
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="canton"
                name="canton"
                value={formData.canton}
                onChange={handleChange}
                required
              >
                {Object.entries(SWISS_CANTON_NAMES).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name} ({code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="address"
              >
                Address *
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="address"
                name="address"
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="eventLink"
            >
              Registration Link *
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="eventLink"
              name="eventLink"
              type="url"
              placeholder="https://..."
              value={formData.eventLink}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="registerUntil"
            >
              Registration Deadline *
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="registerUntil"
              name="registerUntil"
              type="date"
              value={formData.registerUntil}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="logoUrl"
            >
              Logo URL
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="logoUrl"
              name="logoUrl"
              type="url"
              placeholder="https://..."
              value={formData.logoUrl}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={updateLoading}
            >
              {updateLoading ? "Updating..." : "Update Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
