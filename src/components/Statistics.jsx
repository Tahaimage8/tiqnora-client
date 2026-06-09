"use client";

import { motion } from "framer-motion";
import {
  FaBuilding,
  FaCalendarCheck,
  FaChartLine,
  FaTicketAlt,
} from "react-icons/fa";

const Statistics = ({ stats }) => {
  const fallbackStats = {
    totalEvents: 48,
    totalBookings: 1260,
    totalOrganizations: 18,
    platformModules: 6,
  };

  const currentStats = stats || fallbackStats;

  const statItems = [
    {
      icon: <FaCalendarCheck />,
      value: currentStats.totalEvents,
      suffix: "+",
      label: "Events Listed",
      description: "Event listing structure for public browsing.",
      color: "text-cyan-300",
      bg: "bg-cyan-300/10",
    },
    {
      icon: <FaTicketAlt />,
      value: currentStats.totalBookings,
      suffix: "+",
      label: "Bookings Recorded",
      description: "Booking records handled through the platform flow.",
      color: "text-purple-300",
      bg: "bg-purple-300/10",
    },
    {
      icon: <FaBuilding />,
      value: currentStats.totalOrganizations,
      suffix: "+",
      label: "Organizations",
      description: "Organizer profiles connected with event management.",
      color: "text-rose-300",
      bg: "bg-rose-300/10",
    },
    {
      icon: <FaChartLine />,
      value: currentStats.platformModules,
      suffix: "",
      label: "Core Modules",
      description: "Auth, events, bookings, payments, admin, profile.",
      color: "text-emerald-300",
      bg: "bg-emerald-300/10",
    },
  ];

  const formatNumber = (number) => {
    return Number(number || 0).toLocaleString();
  };

  return (
    <section className="relative overflow-hidden bg-[#080C16] px-6 py-24 text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-30 top-1/2 h-90 w-90 -translate-y-1/2 rounded-full bg-[#7C3AED]/15 blur-[130px]" />
      <div className="pointer-events-none absolute -right-30 bottom-0 h-90 w-90 rounded-full bg-[#F43F5E]/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Center Header */}
        <div className="mx-auto mb-14 flex max-w-3xl flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300"
          >
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_#22D3EE]" />
            Platform Snapshot
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-black tracking-tight text-white md:text-5xl"
          >
            A quick look at the
            <span className="block bg-linear-to-r from-cyan-300 via-purple-400 to-rose-400 bg-clip-text text-transparent">
              Tiqnora system.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 max-w-xl text-sm leading-7 text-slate-400"
          >
            This section highlights the main platform areas using clean,
            dashboard-style visual cards.
          </motion.p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="group relative min-h-61.25 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.055]"
            >
              <div className="absolute right-0 top-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full bg-white/5 blur-2xl transition group-hover:bg-white/10" />

              <div
                className={`relative mb-7 flex h-13 w-13 items-center justify-center rounded-2xl ${item.bg} ${item.color} text-xl`}
              >
                {item.icon}
              </div>

              <div className="relative">
                <h3 className="bg-linear-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-4xl font-black text-transparent">
                  {formatNumber(item.value)}
                  {item.suffix}
                </h3>

                <p className="mt-3 text-sm font-bold uppercase tracking-[0.16em] text-white">
                  {item.label}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {item.description}
                </p>
              </div>

              <div className="absolute bottom-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;