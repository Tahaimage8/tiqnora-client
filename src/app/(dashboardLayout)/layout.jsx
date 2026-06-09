/* eslint-disable @next/next/no-img-element */
"use client";

import Logo from "@/components/Logo";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  FaBuilding,
  FaCalendarAlt,
  FaChartLine,
  FaCreditCard,
  FaHome,
  FaPlus,
  FaPlusCircle,
  FaRegUser,
  FaShieldAlt,
  FaSignOutAlt,
  FaTicketAlt,
  FaUsers,
} from "react-icons/fa";
import { MdDashboard, MdEventAvailable, MdPayments } from "react-icons/md";
import { toast } from "sonner";

const menuByRole = {
  attendee: [
    {
      label: "Overview",
      href: "/dashboard/attendee",
      icon: MdDashboard,
    },
    {
      label: "My Bookings",
      href: "/dashboard/attendee/bookings",
      icon: FaTicketAlt,
    },
    {
      label: "Payment History",
      href: "/dashboard/attendee/payments",
      icon: MdPayments,
    },
    {
      label: "Profile",
      href: "/dashboard/attendee/profile",
      icon: FaRegUser,
    },
  ],

  organizer: [
    {
      label: "Overview",
      href: "/dashboard/organizer",
      icon: MdDashboard,
    },
    {
      label: "Organization",
      href: "/dashboard/organizer/organization",
      icon: FaBuilding,
    },
    {
      label: "Add Event",
      href: "/dashboard/organizer/add-event",
      icon: FaPlusCircle,
    },
    {
      label: "Manage Events",
      href: "/dashboard/organizer/events",
      icon: MdEventAvailable,
    },
    {
      label: "Bookings",
      href: "/dashboard/organizer/bookings",
      icon: FaTicketAlt,
    },
    {
      label: "Premium",
      href: "/dashboard/organizer/premium",
      icon: FaCreditCard,
    },
    {
      label: "Profile",
      href: "/dashboard/organizer/profile",
      icon: FaRegUser,
    },
  ],

  admin: [
    {
      label: "Overview",
      href: "/dashboard/admin",
      icon: MdDashboard,
    },
    {
      label: "Users",
      href: "/dashboard/admin/users",
      icon: FaUsers,
    },
    {
      label: "Event Moderation",
      href: "/dashboard/admin/events",
      icon: FaShieldAlt,
    },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: MdPayments,
    },
    {
      label: "Analytics",
      href: "/dashboard/admin/analytics",
      icon: FaChartLine,
    },
  ],
};

const roleColor = {
  admin: "text-yellow-400",
  organizer: "text-indigo-400",
  attendee: "text-pink-400",
};

const DashBoardLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const role = user?.role || "attendee";
  const isBlocked = user?.isBlocked || false;

  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const userImage = user?.image || "";

  const menuItems = menuByRole[role] || menuByRole.attendee;

  const avatarUrl =
    userImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      userName,
    )}&background=7c3aed&color=fff&bold=true`;

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully.");
            router.push("/login");
          },
        },
      });
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");
    }
  }, [isPending, user, router]);

  useEffect(() => {
    if (isBlocked) {
      toast.error("Your account has been blocked.");

      authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
          },
        },
      });
    }
  }, [isBlocked, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080C16] text-white">
        <div className="rounded-3xl border border-white/10 bg-white/4 px-6 py-4 text-sm font-semibold text-slate-300">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const organizerMenu = [
    { key: "overview", label: "Overview", icon: FaUsers },
    { key: "organization", label: "Organization", icon: FaBuilding },
    { key: "add-event", label: "Add Event", icon: FaPlus },
    { key: "manage-events", label: "Manage Events", icon: FaCalendarAlt },
    { key: "attendees", label: "Attendees", icon: FaUsers },
  ];

  return (
    <div className="flex min-h-screen bg-[#080C16] text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-70 flex-col border-r border-white/10 bg-[#0B1120]/95 backdrop-blur-xl lg:flex">
        {/* Brand */}
        <div className="border-b border-white/10 px-6 py-5">
          <Logo />
        </div>

        {/* User Profile */}
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-purple-500/50 bg-white/4">
              <img
                src={avatarUrl}
                alt={userName}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold leading-tight text-white">
                {userName}
              </p>

              <p className="mt-0.5 truncate text-[11px] text-slate-500">
                {userEmail}
              </p>

              <span
                className={`mt-1 block text-[10px] font-bold uppercase tracking-wider ${
                  roleColor[role] || "text-pink-400"
                }`}
              >
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
            Navigation
          </p>

          <div className="space-y-1">
            {menuItems.map(({ label, href, icon: Icon }) => {
              const isActive =
                pathname === href ||
                (href !== `/dashboard/${role}` && pathname.startsWith(href));

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? "border border-purple-500/20 bg-linear-to-r from-purple-500/20 to-rose-500/15 text-white shadow-sm"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      isActive
                        ? "bg-linear-to-br from-[#7C3AED] to-[#F43F5E] text-white shadow-md shadow-purple-500/20"
                        : "bg-white/[0.05] text-slate-400"
                    }`}
                  >
                    <Icon size={14} />
                  </span>

                  <span>{label}</span>

                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Links */}
        <div className="space-y-1 border-t border-white/10 px-3 py-4">
          <Link
            href="/"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400 transition-all duration-150 hover:bg-white/[0.05] hover:text-white"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
              <FaHome size={13} />
            </span>
            Back to Site
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400 transition-all duration-150 hover:bg-red-500/10 hover:text-red-400"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
              <FaSignOutAlt size={13} />
            </span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-[#0B1120]/95 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between">
          <Logo />

          <Link
            href="/"
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-slate-300"
          >
            Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="min-h-screen flex-1 pt-18 lg:ml-70 lg:pt-0">
        <div className="min-h-screen p-5 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default DashBoardLayout;
