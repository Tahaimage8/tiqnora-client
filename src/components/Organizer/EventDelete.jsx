"use client";

import { FaTrash } from "react-icons/fa";

const EventDelete = () => {
  return (
    <button
      type="button"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-400/20 bg-rose-400/10 text-rose-300 transition hover:bg-rose-400/15"
      title="Delete event"
    >
      <FaTrash />
    </button>
  );
};

export default EventDelete;