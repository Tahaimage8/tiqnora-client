/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { FaQuoteLeft, FaUserCircle } from "react-icons/fa";

const Avatar = ({ src, name }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400">
        <FaUserCircle className="text-2xl" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setHasError(true)}
      className="h-12 w-12 shrink-0 rounded-full border border-white/10 object-cover"
    />
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Ayesha Rahman",
      role: "Event Organizer",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
      quote:
        "Tiqnora gives organizers a clean way to create event listings, manage details, and keep the booking flow organized.",
    },
    {
      name: "Tanvir Hasan",
      role: "Event Attendee",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
      quote:
        "The interface feels simple and modern. It makes event browsing, ticket booking, and booking history easy to understand.",
    },
    {
      name: "Nadia Karim",
      role: "Platform Admin",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      quote:
        "The dashboard-first structure makes the platform easier to manage, especially for event review and user control.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#080C16] px-6 py-24 text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-30 top-1/3 h-90 w-90 rounded-full bg-[#7C3AED]/15 blur-[130px]" />
      <div className="pointer-events-none absolute -right-30 bottom-0 h-90 w-90 rounded-full bg-[#F43F5E]/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_#22D3EE]" />
            User Experience
          </div>

          <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
            Designed for a cleaner
            <span className="block bg-linear-to-r from-cyan-300 via-purple-400 to-rose-400 bg-clip-text text-transparent">
              event platform flow.
            </span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-400 md:text-base">
            A simple preview of how Tiqnora can support attendees, organizers,
            and admins through a clean event booking experience.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-7 shadow-2xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/5.5"
            >
              <div className="absolute right-0 top-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full bg-white/5 blur-2xl transition group-hover:bg-white/10" />

              <FaQuoteLeft className="relative mb-6 text-2xl text-cyan-300/70" />

              <p className="relative text-sm leading-7 text-slate-300">
                “{item.quote}”
              </p>

              <div className="relative mt-7 flex items-center gap-4 border-t border-white/10 pt-6">
                <Avatar src={item.image} name={item.name} />

                <div>
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;