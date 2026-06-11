/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { addEvent } from "@/lib/api/events/action";
import {
  FaCalendarAlt,
  FaEnvelope,
  FaImage,
  FaPlusCircle,
  FaTrash,
  FaUpload,
} from "react-icons/fa";

const CATEGORIES = [
  "Music",
  "Technology",
  "Sports",
  "Arts & Culture",
  "Business",
  "Food & Drink",
  "Education",
  "Health & Wellness",
  "Gaming",
  "Travel",
  "Charity",
  "Community",
  "Workshop",
  "Conference",
  "Other",
];

const LOCATIONS = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Cox's Bazar",
  "Gazipur",
  "Narayanganj",
];

const AddEventPage = () => {
  const { data: session, isPending } = authClient.useSession();

  const organizerEmail = session?.user?.email || "";
  const organizerName = session?.user?.name || "Organizer";

  const [creating, setCreating] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    date: "",
    ticketPrice: "",
    capacity: "",
    description: "",
  });

  useEffect(() => {
    if (!selectedBanner) {
      setBannerPreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(selectedBanner);
    setBannerPreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [selectedBanner]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBannerChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid banner image.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Banner image must be under 5MB.");
      return;
    }

    setSelectedBanner(file);
  };

  const removeBanner = () => {
    setSelectedBanner(null);
    setBannerPreview("");
  };

  const uploadImageToImageBB = async (imageFile) => {
    const apiKey = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;

    if (!apiKey) {
      throw new Error("Image upload API key is missing.");
    }

    const imageData = new FormData();
    imageData.append("image", imageFile);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: imageData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result?.success) {
      throw new Error(result?.error?.message || "Banner upload failed.");
    }

    return result?.data?.display_url || result?.data?.url;
  };

  const resetForm = () => {
    setSelectedBanner(null);
    setBannerPreview("");

    setFormData({
      title: "",
      category: "",
      location: "",
      date: "",
      ticketPrice: "",
      capacity: "",
      description: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const title = formData.title.trim();
    const category = formData.category.trim();
    const location = formData.location.trim();
    const date = formData.date;
    const ticketPrice = Number(formData.ticketPrice);
    const availableSeats = Number(formData.capacity);
    const description = formData.description.trim();

    if (!organizerEmail) {
      toast.error("Organizer email not found. Please login again.");
      return;
    }

    if (!title) {
      toast.error("Event title is required.");
      return;
    }

    if (!selectedBanner) {
      toast.error("Event banner image is required.");
      return;
    }

    if (!category) {
      toast.error("Event category is required.");
      return;
    }

    if (!location) {
      toast.error("Event location is required.");
      return;
    }

    if (!date) {
      toast.error("Event date is required.");
      return;
    }

    if (Number.isNaN(ticketPrice) || ticketPrice < 0) {
      toast.error("Ticket price must be valid.");
      return;
    }

    if (Number.isNaN(availableSeats) || availableSeats < 1) {
      toast.error("Available seats must be at least 1.");
      return;
    }

    if (!description) {
      toast.error("Event description is required.");
      return;
    }

    try {
      setCreating(true);

      const bannerUrl = await uploadImageToImageBB(selectedBanner);

      const newEvent = {
        title,
        banner: bannerUrl,
        category,
        location,
        date,
        ticketPrice,
        availableSeats,
        description,
        status: "approved",
        organizerEmail,
        organizerName,
      };

      const response = await addEvent(newEvent);

      if (!response?.success) {
        toast.error(response?.message || "Event creation failed.");
        return;
      }

      console.log("Created event:", response.data);

      toast.success(response?.message || "Event created successfully.");
      resetForm();
    } catch (error) {
      toast.error(error.message || "Event creation failed.");
    } finally {
      setCreating(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-3xl border border-white/10 bg-white/4 px-6 py-4 text-sm font-semibold text-slate-300">
          Loading add event form...
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-8 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#7C3AED]/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-[#F43F5E]/10 blur-[100px]" />

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_#22D3EE]" />
            Organizer Event Setup
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Host a New
            <span className="block bg-linear-to-r from-cyan-300 via-purple-400 to-rose-400 bg-clip-text text-transparent">
              Event.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Add event details, ticket price, available seats, date, location,
            and banner image. Organizer email will be attached automatically.
          </p>

          <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/3 px-4 py-2 text-xs font-semibold text-slate-400">
            <FaEnvelope className="text-cyan-300" />
            <span className="truncate">
              Organizer Email:{" "}
              <span className="text-slate-200">
                {organizerEmail || "Not found"}
              </span>
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="mb-3 text-sm font-semibold text-slate-300">
              Event Banner
            </p>

            <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/3 p-4 md:flex-row md:items-center">
              <div className="flex h-36 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#080C16] text-4xl text-slate-600 md:w-64">
                {bannerPreview ? (
                  <img
                    src={bannerPreview}
                    alt="Event banner preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaImage />
                )}
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-white">
                  Upload event banner
                </p>

                <p className="mt-1 text-xs leading-6 text-slate-500">
                  PNG, JPG, or WEBP. Recommended size: 1200x600px. Maximum 5MB.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <label
                    htmlFor="eventBanner"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-xs font-bold text-slate-300 transition hover:border-cyan-300/40 hover:bg-white/8"
                  >
                    <FaUpload />
                    Choose Banner
                  </label>

                  {selectedBanner && (
                    <button
                      type="button"
                      onClick={removeBanner}
                      className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-500/15"
                    >
                      <FaTrash />
                      Remove
                    </button>
                  )}
                </div>

                <input
                  id="eventBanner"
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                />

                {selectedBanner && (
                  <p className="mt-3 max-w-sm truncate text-xs text-slate-500">
                    {selectedBanner.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Event Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Future Creators Meetup"
                className="w-full rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Category
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-[#0B1120] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Location
              </label>

              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-[#0B1120] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
              >
                <option value="">Select location</option>
                {LOCATIONS.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="date"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300"
              >
                <FaCalendarAlt className="text-cyan-300" />
                Date
              </label>

              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="ticketPrice"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Ticket Price
              </label>

              <input
                id="ticketPrice"
                name="ticketPrice"
                type="number"
                min="0"
                step="any"
                value={formData.ticketPrice}
                onChange={handleChange}
                placeholder="500"
                className="w-full rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
              />
            </div>

            <div>
              <label
                htmlFor="capacity"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Available Seats
              </label>

              <input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="250"
                className="w-full rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-slate-300"
            >
              Detailed Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write the full event details, schedule, speakers, entry rules, facilities, and other important information."
              rows={6}
              className="w-full resize-none rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              radius="full"
              variant="bordered"
              onPress={resetForm}
              isDisabled={creating}
              className="h-11 border border-white/10 bg-white/3 px-6 text-sm font-bold text-white"
            >
              Reset
            </Button>

            <Button
              type="submit"
              radius="full"
              isLoading={creating}
              className="h-11 bg-linear-to-r from-[#7C3AED] to-[#F43F5E] px-7 text-sm font-bold text-white shadow-lg shadow-purple-500/20"
            >
              <FaPlusCircle className="mr-2" />
              Host Event Now
            </Button>
          </div>
        </form>
      </motion.div>
    </section>
  );
};

export default AddEventPage;