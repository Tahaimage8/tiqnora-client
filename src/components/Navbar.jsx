"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaBars,
  FaChevronDown,
  FaSignOutAlt,
  FaTimes,
  FaUser,
  FaUserCircle,
} from "react-icons/fa";
import { MdDashboard, MdEventAvailable } from "react-icons/md";
import { toast } from "sonner";
import Logo from "./Logo";
import { authClient } from "@/lib/auth-client";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const dropdownRef = useRef(null);

  const user = session?.user;
  const isLoggedIn = Boolean(user);

  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const userImage = user?.image || "";
  const userRole = user?.role || "attendee";

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events" },
    { label: "Organizations", href: "/organizations" },
    { label: "About", href: "/about" },
  ];

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setDropdownOpen(false);
            setMobileOpen(false);
            toast.success("Logged out successfully.");
            router.push("/login");
          },
        },
      });
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    setImageError(false);
  }, [userImage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#080C16]/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div onClick={closeMobileMenu}>
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                isActive(link.href)
                  ? "bg-white/10 text-white shadow-lg shadow-purple-500/10"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {isPending ? (
            <div className="h-10 w-32 animate-pulse rounded-full bg-white/[0.05]" />
          ) : !isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-full bg-linear-to-r from-[#7C3AED] to-[#F43F5E] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:shadow-rose-500/25"
              >
                Get Started
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-2 py-2 pr-4 transition hover:border-purple-400/40 hover:bg-white/[0.06]"
              >
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-linear-to-r from-[#7C3AED] to-[#F43F5E] text-sm font-bold text-white">
                  {userImage && !imageError ? (
                    <img
                      src={userImage}
                      alt={userName}
                      onError={() => setImageError(true)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{userName.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                <div className="max-w-32 text-left">
                  <p className="truncate text-xs font-semibold text-white">
                    {userName}
                  </p>
                  <p className="truncate text-[10px] capitalize text-slate-400">
                    {userRole}
                  </p>
                </div>

                <FaChevronDown
                  className={`text-xs text-slate-400 transition ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-3xl border border-white/10 bg-[#101828]/95 shadow-2xl shadow-black/40 backdrop-blur-2xl">
                  <div className="border-b border-white/10 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#22D3EE]">
                      {userRole} Account
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.05] text-slate-400">
                        {userImage && !imageError ? (
                          <img
                            src={userImage}
                            alt={userName}
                            onError={() => setImageError(true)}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FaUserCircle className="text-2xl" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-white">
                          {userName}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-400">
                          {userEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      href={`/dashboard/${userRole}`}
                      onClick={closeDropdown}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                      <MdDashboard className="text-lg text-purple-400" />
                      My Dashboard
                    </Link>

                    <Link
                      href={`/dashboard/${userRole}/profile`}
                      onClick={closeDropdown}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                      <FaUser className="text-sm text-cyan-400" />
                      Profile Settings
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                    >
                      <FaSignOutAlt className="text-sm" />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white transition hover:bg-white/10 lg:hidden"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#080C16]/95 px-4 py-4 backdrop-blur-2xl lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive(link.href)
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isPending ? (
              <div className="mt-3 h-12 animate-pulse rounded-2xl bg-white/[0.05]" />
            ) : isLoggedIn ? (
              <>
                <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.05] text-slate-400">
                      {userImage && !imageError ? (
                        <img
                          src={userImage}
                          alt={userName}
                          onError={() => setImageError(true)}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="text-2xl" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-white">
                        {userName}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {userEmail}
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/dashboard/${userRole}`}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  <MdEventAvailable className="text-lg text-purple-400" />
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-3 w-full rounded-2xl border border-red-500/20 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="mt-3 grid gap-3 border-t border-white/10 pt-4">
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="rounded-2xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={closeMobileMenu}
                  className="rounded-2xl bg-linear-to-r from-[#7C3AED] to-[#F43F5E] px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-purple-500/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;