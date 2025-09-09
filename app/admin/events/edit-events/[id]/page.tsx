"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";
import { NewEvent, SWISS_CANTON_NAMES } from "../../../../types/new-event";
import { Session } from "@supabase/supabase-js";
import { Dojo } from "../../../../types/dojo";

export default function EditEventsPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [organizerType, setOrganizerType] = useState<"organization" | "dojo">(
    "organization"
  );
  const [dojos, setDojos] = useState<Dojo[]>([]);
  const [customOrganizationName, setCustomOrganizationName] =
    useState<string>("");
  const [formData, setFormData] = useState<Omit<NewEvent, "id" | "created_at">>(
    {
      name: "",
      organizer: "",
      organizerurl: "",
      registeruntil: "",
      eventlink: "",
      canton: "ZH",
      address: "",
      type: "competition",
      startdate: "",
      enddate: "",
      starttime: "",
      endtime: "",
      guest_name: "",
      guest_link: "",
    }
  );

  // Organizations data
  const organizations = [
    { id: "ajp", name: "AJP (Abu Dhabi Jiu-Jitsu Pro)" },
    { id: "adcc", name: "ADCC (Abu Dhabi Combat Club)" },
    {
      id: "sbjjnf",
      name: "SBJJNF (Swiss Brazilian Jiu-Jitsu National Federation)",
    },
    { id: "grapplingindustries", name: "Grappling Industries" },
    { id: "sjja", name: "SJJA (Swiss Jiu-jitsu Association)" },
    { id: "other", name: "Other" },
  ];

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        router.push("/admin");
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        router.push("/admin");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Fetch dojos from database
  useEffect(() => {
    async function fetchDojos() {
      try {
        const { data, error } = await supabase
          .from("Dojos")
          .select("*")
          .order("name");

        if (error) {
          console.error("Error fetching dojos:", error);
        } else {
          setDojos(data || []);
        }
      } catch (err) {
        console.error("Error fetching dojos:", err);
      }
    }

    fetchDojos();
  }, []);

  // Fetch event data
  useEffect(() => {
    async function fetchEvent() {
      if (!eventId) return;

      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();

        if (error) {
          console.error("Error fetching event:", error);
          return;
        }

        if (data) {
          setFormData({
            name: data.name || "",
            organizer: data.organizer || "",
            organizerurl: data.organizerurl || "",
            registeruntil: data.registeruntil || "",
            eventlink: data.eventlink || "",
            canton: data.canton || "ZH",
            address: data.address || "",
            type: data.type || "competition",
            startdate: data.startdate || "",
            enddate: data.enddate || "",
            starttime: data.starttime || "",
            endtime: data.endtime || "",
            guest_name: data.guest_name || "",
            guest_link: data.guest_link || "",
          });

          // Set image preview if exists
          if (data.event_img) {
            setImagePreview(data.event_img);
          }

          // Determine organizer type
          if (data.organizer_dojo) {
            setOrganizerType("dojo");
          } else {
            setOrganizerType("organization");
            // Check if it's a custom organization
            if (
              data.organizer &&
              !organizations.find((org) => org.name === data.organizer)
            ) {
              setFormData((prev) => ({ ...prev, organizer: "Other" }));
              setCustomOrganizationName(data.organizer);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    }

    fetchEvent();
  }, [eventId, organizations]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      console.log(
        "Starting image upload for file:",
        file.name,
        "Size:",
        file.size
      );

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `events/${fileName}`;

      console.log("Uploading to path:", filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("events")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return null;
      }

      console.log("Upload successful:", uploadData);

      const { data: urlData } = supabase.storage
        .from("events")
        .getPublicUrl(filePath);

      console.log("Public URL:", urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Upload new image if provided
      let imageUrl = "";
      if (imageFile) {
        console.log("Uploading new image...");
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
          console.log("New image uploaded successfully:", imageUrl);
        } else {
          console.error("Failed to upload new image");
          alert("Failed to upload new image. Please try again.");
          return;
        }
      }

      // Prepare data for submission
      const selectedDojo =
        organizerType === "dojo" && formData.organizer
          ? dojos.find((d) => d.name === formData.organizer)
          : null;

      const dataToSubmit = {
        ...formData,
        // Use enddate if provided, otherwise use startdate
        enddate: formData.enddate || formData.startdate,
        // Use startdate as registration deadline if registeruntil is empty
        registeruntil: formData.registeruntil || formData.startdate,
        // Add new image URL if uploaded, otherwise keep existing
        ...(imageUrl && { event_img: imageUrl }),
        // Use custom organization name if "Other" is selected
        ...(formData.organizer === "Other" &&
          customOrganizationName && {
            organizer: customOrganizationName,
          }),
        // Add organizer_dojo if dojo is selected
        ...(organizerType === "dojo" &&
          formData.organizer && {
            organizer_dojo: selectedDojo?.id,
          }),
        // Use dojo address if address is empty and dojo is selected
        ...(organizerType === "dojo" &&
          !formData.address &&
          selectedDojo && {
            address: selectedDojo.address,
          }),
        // Remove empty optional fields
        ...(formData.organizerurl && { organizerurl: formData.organizerurl }),
        ...(formData.guest_name && { guest_name: formData.guest_name }),
        ...(formData.guest_link && { guest_link: formData.guest_link }),
      };

      console.log("Updating event with data:", dataToSubmit);

      const { error } = await supabase
        .from("events")
        .update(dataToSubmit)
        .eq("id", eventId);

      if (error) {
        console.error("Update error:", error);
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
      setLoading(false);
    }
  };

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
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Organizer Type *
            </label>
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="organizerType"
                  value="organization"
                  checked={organizerType === "organization"}
                  onChange={(e) => {
                    setOrganizerType(e.target.value as "organization" | "dojo");
                    setFormData((prev) => ({ ...prev, organizer: "" }));
                    setCustomOrganizationName("");
                  }}
                  className="mr-2"
                />
                Organization
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="organizerType"
                  value="dojo"
                  checked={organizerType === "dojo"}
                  onChange={(e) => {
                    setOrganizerType(e.target.value as "organization" | "dojo");
                    setFormData((prev) => ({ ...prev, organizer: "" }));
                    setCustomOrganizationName("");
                  }}
                  className="mr-2"
                />
                Dojo
              </label>
            </div>

            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="organizer"
            >
              {organizerType === "organization" ? "Organization" : "Dojo"} *
            </label>
            {organizerType === "organization" ? (
              <div>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="organizer"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select an organization</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.name}>
                      {org.name}
                    </option>
                  ))}
                </select>
                {formData.organizer === "Other" && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Enter organization name"
                      value={customOrganizationName}
                      onChange={(e) =>
                        setCustomOrganizationName(e.target.value)
                      }
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                )}
              </div>
            ) : (
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="organizer"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                required
              >
                <option value="">Select a dojo</option>
                {dojos.map((dojo) => (
                  <option key={dojo.id} value={dojo.name}>
                    {dojo.name} ({dojo.kanton})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="event_img"
            >
              Event Image
            </label>
            {imagePreview && (
              <div className="mb-2">
                <img
                  src={imagePreview}
                  alt="Current event image"
                  className="w-32 h-32 object-cover rounded"
                />
                <p className="text-xs text-gray-500 mt-1">Current image</p>
              </div>
            )}
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="event_img"
              name="event_img"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to keep current image, or select a new image to
              replace it
            </p>
          </div>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="startdate"
              >
                Start Date *
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="startdate"
                name="startdate"
                type="date"
                value={formData.startdate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="enddate"
              >
                End Date
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="enddate"
                name="enddate"
                type="date"
                value={formData.enddate}
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
                htmlFor="starttime"
              >
                Start Time *
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="starttime"
                name="starttime"
                type="time"
                value={formData.starttime}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="endtime"
              >
                End Time *
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="endtime"
                name="endtime"
                type="time"
                value={formData.endtime}
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
              <option value="camp">Camp</option>
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
                Address
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="address"
                name="address"
                type="text"
                placeholder={
                  organizerType === "dojo"
                    ? "Leave empty to use dojo address"
                    : "Address"
                }
                value={formData.address}
                onChange={handleChange}
              />
              {organizerType === "dojo" && (
                <p className="text-xs text-gray-500 mt-1">
                  If left empty, will use the selected dojo's address
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="eventlink"
            >
              Registration Link *
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="eventlink"
              name="eventlink"
              type="url"
              placeholder="https://..."
              value={formData.eventlink}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="registeruntil"
            >
              Registration Deadline
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="registeruntil"
              name="registeruntil"
              type="date"
              value={formData.registeruntil}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500 mt-1">
              If left empty, will use the start date as registration deadline
            </p>
          </div>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="guest_name"
              >
                Guest Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="guest_name"
                name="guest_name"
                type="text"
                placeholder="Guest instructor name"
                value={formData.guest_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="guest_link"
              >
                Guest Link
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="guest_link"
                name="guest_link"
                type="url"
                placeholder="https://..."
                value={formData.guest_link}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
