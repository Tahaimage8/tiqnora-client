"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaBuilding,
  FaCalendarAlt,
  FaCrown,
  FaDollarSign,
  FaPlusCircle,
  FaTicketAlt,
  FaUsers,
} from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";

const OrganizerOverviewPage = () => {
  // Later ei data backend/API theke ashbe
  const stats = {
    totalEvents: 15,
    totalAttendees: 450,
    totalRevenue: 25000,
    totalSoldTickets: 780,
  };


  const isPremium = true;

  const statCards = [
    {
      label: "Hosted Events",
      value: stats.totalEvents,
      helper: "Total events created by you",
      icon: FaCalendarAlt,
      color: "text-cyan-300",
      bg: "bg-cyan-300/10",
      border: "border-cyan-300/20",
    },
    {
      label: "Total Attendees",
      value: stats.totalAttendees,
      helper: "People joined your events",
      icon: FaUsers,
      color: "text-purple-300",
      bg: "bg-purple-300/10",
      border: "border-purple-300/20",
    },
    {
      label: "Tickets Sold",
      value: stats.totalSoldTickets,
      helper: "Tickets sold across events",
      icon: FaTicketAlt,
      color: "text-rose-300",
      bg: "bg-rose-300/10",
      border: "border-rose-300/20",
    },
    {
      label: "Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      helper: "Accumulated event revenue",
      icon: FaDollarSign,
      color: "text-emerald-300",
      bg: "bg-emerald-300/10",
      border: "border-emerald-300/20",
    },
  ];

  const quickActions = [
    {
      title: "Create Event",
      description: "Add a new event with ticket price, seat limit, and details.",
      icon: FaPlusCircle,
      href: "/dashboard/organizer/add-event",
    },
    {
      title: "Manage Events",
      description: "Update, review, or remove your existing event listings.",
      icon: MdEventAvailable,
      href: "/dashboard/organizer/events",
    },
    {
      title: "Organization Profile",
      description: "Manage your organization logo, website, and description.",
      icon: FaBuilding,
      href: "/dashboard/organizer/organization",
    },
  ];

  return (
    <section className="space-y-8 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#7C3AED]/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-[#F43F5E]/10 blur-[100px]" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_#22D3EE]" />
              Organizer Dashboard
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Manage your events
              <span className="block bg-linear-to-r from-cyan-300 via-purple-400 to-rose-400 bg-clip-text text-transparent">
                with clarity.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              Track event performance, monitor ticket sales, manage attendees,
              and keep your organizer workflow clean from one dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/organizer/add-event"
              className="inline-flex h-12 items-center justify-center rounded-full bg-linear-to-r from-[#7C3AED] to-[#F43F5E] px-6 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition hover:-translate-y-0.5 hover:shadow-rose-500/25"
            >
              <FaPlusCircle className="mr-2" />
              Add Event
            </Link>

            <Link
              href="/dashboard/organizer/events"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/3 px-6 text-sm font-bold text-white transition hover:border-white/20 hover:bg-white/6"
            >
              Manage Events
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
              className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/5.5"
            >
              <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full bg-white/5 blur-2xl transition group-hover:bg-white/10" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    {item.label}
                  </p>

                  <h2 className="mt-3 text-3xl font-black text-white">
                    {item.value}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {item.helper}
                  </p>
                </div>

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${item.border} ${item.bg} ${item.color}`}
                >
                  <Icon size={20} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Upgrade Card Only When Not Premium */}
      {!isPremium && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[1.75rem] border border-yellow-400/20 bg-yellow-400/6 p-6 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-8"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-yellow-400/20 blur-[80px]" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/10 text-yellow-300">
                <FaCrown />
              </div>

              <div>
                <h2 className="text-xl font-black text-white">
                  Upgrade to Premium
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
                  Standard organizer accounts can create limited events. Upgrade
                  to premium to unlock unlimited event creation.
                </p>
              </div>
            </div>

            <Button
              as={Link}
              href="/dashboard/organizer/premium"
              radius="full"
              className="h-12 w-full bg-yellow-400 px-6 text-sm font-black text-slate-950 shadow-lg shadow-yellow-400/10 sm:w-fit"
            >
              <FaCrown className="mr-2" />
              Upgrade Now
            </Button>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-8"
      >
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Quick Actions</h2>
            <p className="mt-2 text-sm text-slate-400">
              Move faster with common organizer tasks.
            </p>
          </div>

          <Link
            href="/dashboard/organizer/events"
            className="inline-flex items-center gap-2 text-sm font-bold text-cyan-300 transition hover:text-cyan-200"
          >
            View events
            <FaArrowRight className="text-xs" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B1120]/80 p-5 transition hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-white/4.5"
              >
                <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 translate-x-10 -translate-y-10 rounded-full bg-cyan-300/10 blur-2xl opacity-0 transition group-hover:opacity-100" />

                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
                  <Icon />
                </div>

                <h3 className="relative mt-5 font-bold text-white">
                  {action.title}
                </h3>

                <p className="relative mt-2 text-sm leading-6 text-slate-500">
                  {action.description}
                </p>

                <div className="relative mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500 transition group-hover:text-cyan-300">
                  Open
                  <FaArrowRight className="transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default OrganizerOverviewPage;