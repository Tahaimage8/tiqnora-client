"use client";

import {
  FaCalendarCheck,
  FaShieldAlt,
  FaTicketAlt,
  FaUserCog,
} from "react-icons/fa";

const WhyChoose = () => {
  const features = [
    {
      icon: <FaCalendarCheck />,
      title: "Clean Event Discovery",
      description:
        "A simple interface for browsing event listings, viewing details, and finding relevant events faster.",
      color: "text-cyan-300",
      bg: "bg-cyan-300/10",
    },
    {
      icon: <FaTicketAlt />,
      title: "Ticket Booking Flow",
      description:
        "A focused booking experience designed for selecting tickets, confirming details, and managing bookings.",
      color: "text-purple-300",
      bg: "bg-purple-300/10",
    },
    {
      icon: <FaUserCog />,
      title: "Organizer Management",
      description:
        "Organizers can create event listings, manage event information, and keep track of booking activity.",
      color: "text-rose-300",
      bg: "bg-rose-300/10",
    },
    {
      icon: <FaShieldAlt />,
      title: "Admin Moderation",
      description:
        "Admin control helps review platform activity, manage users, and keep event listings organized.",
      color: "text-emerald-300",
      bg: "bg-emerald-300/10",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#080C16] px-6 py-24 text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-30 top-1/3 h-90 w-90 rounded-full bg-[#7C3AED]/15 blur-[130px]" />
      <div className="pointer-events-none absolute -right-30 bottom-0 h-90 w-90 rounded-full bg-[#F43F5E]/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_#22D3EE]" />
            Why Tiqnora
          </div>

          <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
            Built for a smoother
            <span className="block bg-linear-to-r from-cyan-300 via-purple-400 to-rose-400 bg-clip-text text-transparent">
              event booking experience.
            </span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-400 md:text-base">
            Tiqnora keeps the core event platform experience clean, organized,
            and easy to use for attendees, organizers, and admins.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/5.5"
            >
              <div
                className={`mb-6 flex h-13 w-13 items-center justify-center rounded-2xl ${feature.bg} ${feature.color} text-xl transition-transform duration-300 group-hover:scale-110`}
              >
                {feature.icon}
              </div>

              <h3 className="text-lg font-black text-white">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {feature.description}
              </p>

              <div className="mt-6 h-px w-full bg-linear-to-r from-transparent via-white/15 to-transparent" />

              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Tiqnora Feature
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;