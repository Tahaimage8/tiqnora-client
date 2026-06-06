"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaTicketAlt,
} from "react-icons/fa";

const Hero = () => {
  return (
    <section className="relative min-h-[88vh] overflow-hidden bg-[#080C16] px-6 py-24 text-white">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-30 -top-30 h-105 w-105 rounded-full bg-[#7C3AED]/25 blur-[140px]" />
        <div className="absolute -right-35 -bottom-30 h-105 w-105 rounded-full bg-[#F43F5E]/15 blur-[140px]" />
        <div className="absolute left-1/2 top-1/3 h-80 w-[320px] -translate-x-1/2 rounded-full bg-[#22D3EE]/10 blur-[130px]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-size-[80px_80px] opacity-25" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_#22D3EE]" />
            Tiqnora Event Platform
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[1.04] tracking-tight md:text-7xl">
            Discover events.
            <span className="block bg-linear-to-r from-cyan-300 via-purple-400 to-rose-400 bg-clip-text text-transparent">
              Book tickets
            </span>
            effortlessly.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 md:text-lg">
            Tiqnora is a modern event ticket booking platform with a clean
            interface for browsing events, creating event listings, and managing
            bookings.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link href="/events" className="w-full sm:w-auto">
              <Button
                radius="full"
                className="h-14 w-full bg-linear-to-r from-[#7C3AED] to-[#F43F5E] px-8 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition-all hover:-translate-y-0.5 hover:shadow-rose-500/30 sm:w-auto"
              >
                Explore Events
                <FaArrowRight className="ml-2 text-xs" />
              </Button>
            </Link>

            <Link href="/register" className="w-full sm:w-auto">
              <Button
                radius="full"
                variant="bordered"
                className="h-14 w-full border border-white/15 bg-white/3 px-8 text-sm font-bold text-white backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-white/6 sm:w-auto"
              >
                Create Event
              </Button>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {["Event Listings", "Ticket Booking", "Booking Management"].map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/3 px-4 py-2 text-xs font-semibold text-slate-300"
                >
                  {item}
                </span>
              )
            )}
          </div>
        </motion.div>

        {/* Right Visual */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.15 }}
          className="relative mx-auto w-full max-w-lg"
        >
          <div className="rounded-[2rem] border border-white/10 bg-white/4 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl">
            <div className="rounded-[1.5rem] border border-white/10 bg-[#0B1120] p-6">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Product Preview
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-white">
                    Event Booking UI
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#7C3AED] to-[#F43F5E] text-white shadow-lg shadow-purple-500/20">
                  <FaTicketAlt />
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-linear-to-br from-[#7C3AED]/30 via-[#101828] to-[#F43F5E]/20 p-5">
                {/* Custom Ticket Visual */}
                <div className="relative mb-5 h-40 overflow-hidden rounded-2xl border border-white/10 bg-[#080C16]">
                  <div className="absolute inset-0 bg-linear-to-br from-cyan-300/20 via-purple-500/20 to-rose-400/20" />

                  <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-cyan-300/20 blur-2xl" />
                  <div className="absolute -right-10 -bottom-10 h-28 w-28 rounded-full bg-rose-400/20 blur-2xl" />

                  <div className="absolute left-1/2 top-1/2 flex w-[78%] -translate-x-1/2 -translate-y-1/2 items-center justify-between rounded-2xl border border-white/20 bg-white/8 p-4 backdrop-blur-xl">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-200">
                        Digital Ticket
                      </p>

                      <p className="mt-2 text-lg font-black text-white">
                        Event Access Pass
                      </p>

                      <div className="mt-3 flex gap-2">
                        <span className="h-2 w-14 rounded-full bg-white/30" />
                        <span className="h-2 w-8 rounded-full bg-white/20" />
                      </div>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
                      <FaTicketAlt />
                    </div>
                  </div>

                  <div className="absolute left-[10%] top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-[#080C16]" />
                  <div className="absolute right-[10%] top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-[#080C16]" />
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                  Event Card
                </p>

                <h4 className="mt-3 text-2xl font-black text-white">
                  Clean event details layout
                </h4>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  A focused interface for event title, date, location, ticket
                  price, and booking action.
                </p>

                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-300">
                    <FaCalendarAlt />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">
                      Event information
                    </p>
                    <p className="text-xs text-slate-500">
                      Date, location, ticket and availability
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Minimal Decoration */}
          <div className="absolute -right-4 top-10 hidden h-16 w-16 rounded-full border border-cyan-300/20 bg-cyan-300/10 backdrop-blur-xl md:block" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;