"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaEdit,
  FaImage,
  FaTimes,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import { updateEvent } from "@/lib/api/events/action";

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

const EventEdit = ({ event, onUpdated }) => {
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const [selectedBanner, setSelectedBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [uploadedBannerUrl, setUploadedBannerUrl] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    date: "",
    ticketPrice: "",
    availableSeats: "",
    description: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!selectedBanner) return;

    const previewUrl = URL.createObjectURL(selectedBanner);
    setBannerPreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [selectedBanner]);

  const openModal = () => {
    setFormData({
      title: event?.title || "",
      category: event?.category || "",
      location: event?.location || "",
      date: event?.date || "",
      ticketPrice: event?.ticketPrice || "",
      availableSeats: event?.availableSeats || "",
      description: event?.description || "",
    });

    setSelectedBanner(null);
    setBannerPreview(event?.banner || "");
    setUploadedBannerUrl(event?.banner || "");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (updating || uploadingBanner) return;

    setModalOpen(false);
    setSelectedBanner(null);
    setBannerPreview("");
    setUploadedBannerUrl("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleBannerChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid banner image.");
      e.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Banner image must be under 5MB.");
      e.target.value = "";
      return;
    }

    try {
      setSelectedBanner(file);
      setUploadedBannerUrl("");
      setUploadingBanner(true);

      const imageUrl = await uploadImageToImageBB(file);

      setUploadedBannerUrl(imageUrl);
      toast.success("Banner uploaded successfully.");
    } catch (error) {
      setSelectedBanner(null);
      setBannerPreview(event?.banner || "");
      setUploadedBannerUrl(event?.banner || "");
      toast.error(error.message || "Banner upload failed.");
    } finally {
      setUploadingBanner(false);
    }
  };

  const removeNewBanner = () => {
    setSelectedBanner(null);
    setBannerPreview(event?.banner || "");
    setUploadedBannerUrl(event?.banner || "");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const title = formData.title.trim();
    const category = formData.category.trim();
    const location = formData.location.trim();
    const date = formData.date;
    const ticketPrice = Number(formData.ticketPrice);
    const availableSeats = Number(formData.availableSeats);
    const description = formData.description.trim();

    if (!event?._id) {
      toast.error("Event id not found.");
      return;
    }

    if (!event?.organizerEmail) {
      toast.error("Organizer email not found.");
      return;
    }

    if (!title) {
      toast.error("Event title is required.");
      return;
    }

    if (uploadingBanner) {
      toast.error("Banner is still uploading. Please wait.");
      return;
    }

    if (!uploadedBannerUrl) {
      toast.error("Banner image is required.");
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
      setUpdating(true);

      const updatedData = {
        title,
        banner: uploadedBannerUrl,
        category,
        location,
        date,
        ticketPrice,
        availableSeats,
        description,
        status: event.status || "approved",
        organizerEmail: event.organizerEmail,
        organizerName: event.organizerName || "Organizer",
      };

      const response = await updateEvent(event._id, updatedData);

      if (!response?.success) {
        toast.error(response?.message || "Event update failed.");
        return;
      }

      onUpdated(response.data);

      toast.success(response?.message || "Event updated successfully.");
      closeModal();
    } catch (error) {
      toast.error(error.message || "Event update failed.");
    } finally {
      setUpdating(false);
    }
  };

  const modalContent =
    modalOpen && mounted ? (
      <div className="fixed inset-0 z-100 flex items-center justify-center px-4 py-6">
        <button
          type="button"
          aria-label="Close edit modal overlay"
          onClick={closeModal}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-white/10 bg-[#0B1120] p-6 shadow-2xl shadow-black/50 sm:p-7"
        >
          <button
            type="button"
            onClick={closeModal}
            disabled={updating || uploadingBanner}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/4 text-slate-300 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaTimes />
          </button>

          <h2 className="pr-12 text-2xl font-black text-white">
            Update Event
          </h2>

          <form onSubmit={handleUpdate} className="mt-6 space-y-5">
            <div>
              <p className="mb-3 text-sm font-semibold text-slate-300">
                Event Banner
              </p>

              <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/3 p-4 md:flex-row md:items-center">
                <div className="flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#080C16] text-4xl text-slate-600 md:w-56">
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
                    Change event banner
                  </p>

                  <p className="mt-1 text-xs leading-6 text-slate-500">
                    PNG, JPG, or WEBP. Maximum 5MB.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <label
                      htmlFor={`eventBanner-${event?._id}`}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-xs font-bold text-slate-300 transition hover:border-cyan-300/40 hover:bg-white/8"
                    >
                      <FaUpload />
                      Choose Banner
                    </label>

                    {selectedBanner && (
                      <button
                        type="button"
                        onClick={removeNewBanner}
                        className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-500/15"
                      >
                        <FaTrash />
                        Remove
                      </button>
                    )}
                  </div>

                  <input
                    id={`eventBanner-${event?._id}`}
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    className="hidden"
                  />

                  {uploadingBanner && (
                    <p className="mt-2 text-xs font-semibold text-cyan-300">
                      Uploading banner...
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Event Title
                </label>

                <input
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Category
                </label>

                <select
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
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Location
                </label>

                <select
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
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
                  <FaCalendarAlt className="text-cyan-300" />
                  Date
                </label>

                <input
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
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Ticket Price
                </label>

                <input
                  name="ticketPrice"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.ticketPrice}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Available Seats
                </label>

                <input
                  name="availableSeats"
                  type="number"
                  min="1"
                  value={formData.availableSeats}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                disabled={updating || uploadingBanner}
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/3 px-6 text-sm font-bold text-white transition hover:bg-white/6 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updating || uploadingBanner}
                className="inline-flex h-11 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-6 text-sm font-bold text-cyan-200 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updating ? "Updating..." : "Update Event"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    ) : null;

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 transition hover:bg-cyan-400/15"
        title="Edit event"
      >
        <FaEdit />
      </button>

      {mounted && createPortal(modalContent, document.body)}
    </>
  );
};

export default EventEdit;