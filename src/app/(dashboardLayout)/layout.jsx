/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import Logo from "@/components/Logo";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaBars,
  FaBuilding,
  FaChartLine,
  FaHome,
  FaPlusCircle,
  FaRegUser,
  FaShieldAlt,
  FaSignOutAlt,
  FaTicketAlt,
  FaTimes,
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
      label: "Attendees",
      href: "/dashboard/organizer/attendees",
      icon: FaUsers,
    },
  ],

  admin: [

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

const SidebarContent = ({
  userName,
  userEmail,
  avatarUrl,
  role,
  menuItems,
  pathname,
  handleLogout,
  closeMobileMenu,
}) => {
  return (
    <>
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
                onClick={closeMobileMenu}
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
                      : "bg-white/5 text-slate-400"
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
          onClick={closeMobileMenu}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400 transition-all duration-150 hover:bg-white/5 hover:text-white"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
            <FaHome size={13} />
          </span>
          Back to Site
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400 transition-all duration-150 hover:bg-red-500/10 hover:text-red-400"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
            <FaSignOutAlt size={13} />
          </span>
          Sign Out
        </button>
      </div>
    </>
  );
};

const DashBoardLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
      userName
    )}&background=7c3aed&color=fff&bold=true`;

  const closeMobileMenu = () => {
    setMobileSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setMobileSidebarOpen(false);
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

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080C16] px-6 text-white">
        <div className="rounded-3xl border border-white/10 bg-white/4 px-6 py-4 text-sm font-semibold text-slate-300">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#080C16] text-white">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-70 flex-col border-r border-white/10 bg-[#0B1120]/95 backdrop-blur-xl lg:flex">
        <SidebarContent
          userName={userName}
          userEmail={userEmail}
          avatarUrl={avatarUrl}
          role={role}
          menuItems={menuItems}
          pathname={pathname}
          handleLogout={handleLogout}
          closeMobileMenu={closeMobileMenu}
        />
      </aside>

      {/* Mobile Top Bar */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#0B1120]/95 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between">
          <Logo />

          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/4 text-white transition hover:bg-white/8"
          >
            <FaBars />
          </button>
        </div>
      </header>

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed left-0 top-0 z-60 flex h-screen w-70 flex-col border-r border-white/10 bg-[#0B1120] shadow-2xl shadow-black/40 transition-transform duration-300 lg:hidden ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute right-3 top-3">
          <button
            type="button"
            onClick={closeMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/4 text-slate-300 transition hover:bg-white/8 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>

        <SidebarContent
          userName={userName}
          userEmail={userEmail}
          avatarUrl={avatarUrl}
          role={role}
          menuItems={menuItems}
          pathname={pathname}
          handleLogout={handleLogout}
          closeMobileMenu={closeMobileMenu}
        />
      </aside>

      {/* Main Content */}
      <main className="min-h-screen pt-18 lg:ml-70 lg:pt-0">
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default DashBoardLayout;