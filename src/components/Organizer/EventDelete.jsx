"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { FaExclamationTriangle, FaTimes, FaTrash } from "react-icons/fa";
import { deleteEvent } from "@/lib/api/events/action";

const EventDelete = ({ event, onDeleted }) => {
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    if (deleting) return;
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (!event?._id) {
      toast.error("Event id not found.");
      return;
    }

    if (!event?.organizerEmail) {
      toast.error("Organizer email not found.");
      return;
    }

    try {
      setDeleting(true);

      const response = await deleteEvent(event._id, event.organizerEmail);

      if (!response?.success) {
        toast.error(response?.message || "Event delete failed.");
        return;
      }

      onDeleted(event._id);

      toast.success(response?.message || "Event deleted successfully.");
      setModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Event delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  const modalContent =
    modalOpen && mounted ? (
      <div className="fixed inset-0 z-100 flex items-center justify-center px-4 py-6">
        <button
          type="button"
          aria-label="Close delete modal overlay"
          onClick={closeModal}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-rose-400/20 bg-[#0B1120] p-6 shadow-2xl shadow-black/50 sm:p-7"
        >
          <button
            type="button"
            onClick={closeModal}
            disabled={deleting}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/4 text-slate-300 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaTimes />
          </button>

          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/10 text-rose-300">
            <FaExclamationTriangle size={22} />
          </div>

          <h2 className="pr-10 text-2xl font-black text-white">
            Delete event?
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-400">
            Are you sure you want to delete{" "}
            <span className="font-bold text-white">
              {event?.title || "this event"}
            </span>
            ? This action cannot be undone.
          </p>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeModal}
              disabled={deleting}
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/3 px-6 text-sm font-bold text-white transition hover:bg-white/6 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex h-11 items-center justify-center rounded-full border border-rose-400/20 bg-rose-500/15 px-6 text-sm font-bold text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleting ? (
                "Deleting..."
              ) : (
                <>
                  <FaTrash className="mr-2" />
                  Delete
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    ) : null;

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-400/20 bg-rose-400/10 text-rose-300 transition hover:bg-rose-400/15"
        title="Delete event"
      >
        <FaTrash />
      </button>

      {mounted && createPortal(modalContent, document.body)}
    </>
  );
};

export default EventDelete;