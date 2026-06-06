import Link from "next/link";
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import Logo from "./Logo";

const Footer = () => {
  const footerLinks = [
    {
      title: "Platform",
      links: [
        { label: "Browse Events", href: "/events" },
        { label: "Organizations", href: "/organizations" },
        { label: "Organizer Dashboard", href: "/dashboard/organizer" },
        { label: "Admin Panel", href: "/dashboard/admin" },
      ],
    },
    {
      title: "Event Types",
      links: [
        { label: "Tech Conferences", href: "/events?category=Tech" },
        { label: "Music Festivals", href: "/events?category=Music" },
        { label: "Startup Meetups", href: "/events?category=Startup" },
        { label: "Art Exhibitions", href: "/events?category=Arts" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, href: "#", label: "Facebook" },
    { icon: <FaInstagram />, href: "#", label: "Instagram" },
    { icon: <FaLinkedinIn />, href: "#", label: "LinkedIn" },
    { icon: <FaGithub />, href: "#", label: "GitHub" },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/10 bg-[#080C16]">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#7C3AED]/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#F43F5E]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand Area */}
          <div className="lg:col-span-5">
            <Logo />

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
              Tiqnora is a modern event ticket booking and management platform
              for attendees, organizers, and admins. Discover events, book
              tickets, manage sales, and moderate everything from one premium
              dashboard.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/3 text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/40 hover:bg-white/6 hover:text-white hover:shadow-lg hover:shadow-purple-500/20"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-7">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-white">
                  {group.title}
                </h3>

                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Tiqnora Inc. All rights reserved.</p>

          <div className="flex flex-wrap gap-4">
            <span className="rounded-full border border-white/10 bg-white/3 px-4 py-2 text-xs font-semibold text-slate-400">
              Secure Stripe Payments
            </span>
            <span className="rounded-full border border-white/10 bg-white/3 px-4 py-2 text-xs font-semibold text-slate-400">
              Role-Based Dashboards
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;