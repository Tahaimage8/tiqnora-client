"use client";

import { FaEdit } from "react-icons/fa";

const EventEdit = () => {
  return (
    <button
      type="button"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 transition hover:bg-cyan-400/15"
      title="Edit event"
    >
      <FaEdit />
    </button>
  );
};

export default EventEdit;