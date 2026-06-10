"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import {
  FaArrowRight,
  FaBuilding,
  FaCalendarAlt,
  FaChartLine,
  FaCrown,
  FaShieldAlt,
  FaTicketAlt,
  FaUserCircle,
  FaUsers,
} from "react-icons/fa";
import { MdDashboard, MdEventAvailable, MdPayments } from "react-icons/md";

const roleConfig = {
  attendee: {
    label: "Attendee",
    title: "Your event journey starts here.",
    description:
      "Browse events, manage bookings, track payment history, and keep your profile updated.",
    primaryHref: "/dashboard/attendee",
    primaryLabel: "Go to Attendee Dashboard",
    accent: "from-pink-400 to-rose-500",
    glow: "bg-rose-500/20",
    actions: [
      {
        title: "My Bookings",
        description: "View your ticket booking history.",
        href: "/dashboard/attendee/bookings",
        icon: FaTicketAlt,
      },
      {
        title: "Payment History",
        description: "Check your completed payment records.",
        href: "/dashboard/attendee/payments",
        icon: MdPayments,
      },
      {
        title: "Profile",
        description: "Manage your attendee profile details.",
        href: "/dashboard/attendee/profile",
        icon: FaUserCircle,
      },
    ],
  },

  organizer: {
    label: "Organizer",
    title: "Manage events with confidence.",
    description:
      "Create events, manage organization details, track attendees, and monitor event activity.",
    primaryHref: "/dashboard/organizer",
    primaryLabel: "Go to Organizer Dashboard",
    accent: "from-cyan-300 to-purple-500",
    glow: "bg-purple-500/20",
    actions: [
      {
        title: "Organization",
        description: "Set up or update your organization profile.",
        href: "/dashboard/organizer/organization",
        icon: FaBuilding,
      },
      {
        title: "Add Event",
        description: "Create a new event with seats and ticket details.",
        href: "/dashboard/organizer/add-event",
        icon: FaCalendarAlt,
      },
      {
        title: "Manage Events",
        description: "Review and update your event listings.",
        href: "/dashboard/organizer/events",
        icon: MdEventAvailable,
      },
    ],
  },

  admin: {
    label: "Admin",
    title: "Control the platform layer.",
    description:
      "Manage users, moderate events, monitor transactions, and keep the platform secure.",
    primaryHref: "/dashboard/admin",
    primaryLabel: "Go to Admin Dashboard",
    accent: "from-yellow-300 to-orange-500",
    glow: "bg-yellow-500/20",
    actions: [
      {
        title: "User Management",
        description: "Block, unblock, and manage platform users.",
        href: "/dashboard/admin/users",
        icon: FaUsers,
      },
      {
        title: "Event Moderation",
        description: "Approve, reject, or review submitted events.",
        href: "/dashboard/admin/events",
        icon: FaShieldAlt,
      },
      {
        title: "Analytics",
        description: "View platform activity and system insights.",
        href: "/dashboard/admin/analytics",
        icon: FaChartLine,
      },
    ],
  },
};

const platformModules = [
  {
    title: "Events",
    description: "Create, browse, and manage event listings.",
    icon: MdEventAvailable,
  },
  {
    title: "Bookings",
    description: "Track ticket booking and attendee flow.",
    icon: FaTicketAlt,
  },
  {
    title: "Payments",
    description: "Review ticket and premium payment records.",
    icon: MdPayments,
  },
  {
    title: "Roles",
    description: "Attendee, organizer, and admin access paths.",
    icon: MdDashboard,
  },
];

const DashBoard = () => {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const role = user?.role || "attendee";
  const config = roleConfig[role] || roleConfig.attendee;

  if (isPending) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-4 text-sm font-semibold text-slate-300">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-8 overflow-hidden">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8 lg:p-10"
      >
        <div
          className={`pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full ${config.glow} blur-[110px]`}
        />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-[#F43F5E]/10 blur-[100px]" />

        <div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_#22D3EE]" />
              Main Dashboard
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Welcome back,
              <span
                className={`block bg-linear-to-r ${config.accent} bg-clip-text text-transparent`}
              >
                {user?.name || "User"}.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              {config.description}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={config.primaryHref}
                className={`inline-flex h-12 items-center justify-center rounded-full bg-linear-to-r ${config.accent} px-6 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5`}
              >
                {config.primaryLabel}
                <FaArrowRight className="ml-2 text-xs" />
              </Link>

              <Link
                href="/"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-6 text-sm font-bold text-white transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                Back to Website
              </Link>
            </div>
          </div>

          {/* Role Card */}
          <div className="rounded-[1.75rem] border border-white/10 bg-[#0B1120]/80 p-6 shadow-xl shadow-black/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Current Role
                </p>

                <h2 className="mt-3 text-3xl font-black text-white">
                  {config.label}
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Your dashboard navigation and access are based on this role.
                </p>
              </div>

              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${config.accent} text-white shadow-lg shadow-purple-500/20`}
              >
                <MdDashboard size={22} />
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Account
              </p>
              <p className="mt-2 truncate text-sm font-semibold text-slate-300">
                {user?.email || "No email found"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Role Actions */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {config.actions.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
            >
              <Link
                href={item.href}
                className="group block h-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-white/[0.055]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
                  <Icon size={20} />
                </div>

                <h3 className="mt-5 text-lg font-black text-white">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {item.description}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500 transition group-hover:text-cyan-300">
                  Open
                  <FaArrowRight className="transition group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Platform Modules */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12 }}
        className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-8"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-black text-white">Platform Modules</h2>
          <p className="mt-2 text-sm text-slate-400">
            Tiqnora is structured around event creation, ticket booking,
            payments, and role-based dashboards.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {platformModules.map((module) => {
            const Icon = module.icon;

            return (
              <div
                key={module.title}
                className="rounded-2xl border border-white/10 bg-[#0B1120]/80 p-5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-300/10 text-purple-300">
                  <Icon />
                </div>

                <h3 className="mt-4 font-bold text-white">{module.title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {module.description}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default DashBoard;