/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

import {
  FaCalendarAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTicketAlt,
} from "react-icons/fa";
import { getMyEvents } from "@/lib/api/events/action";

const EventsPage = () => {
  const { data: session, isPending } = authClient.useSession();

  const organizerEmail = session?.user?.email || "";

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    if (isPending) return;

    if (!organizerEmail) {
      setLoadingEvents(false);
      return;
    }

    const loadMyEvents = async () => {
      try {
        setLoadingEvents(true);

        const response = await getMyEvents(organizerEmail);

        if (response?.success) {
          setEvents(response.data || []);
        }
      } catch (error) {
        toast.error(error.message || "Failed to load events.");
      } finally {
        setLoadingEvents(false);
      }
    };

    loadMyEvents();
  }, [isPending, organizerEmail]);

  if (isPending || loadingEvents) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-3xl border border-white/10 bg-white/4 px-6 py-4 text-sm font-semibold text-slate-300">
          Loading events...
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-8 overflow-hidden">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#7C3AED]/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-[#F43F5E]/10 blur-[100px]" />

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_#22D3EE]" />
            Organizer Events
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            My Added
            <span className="block bg-linear-to-r from-cyan-300 via-purple-400 to-rose-400 bg-clip-text text-transparent">
              Events.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Here you can see all events created by your organizer account.
          </p>

          <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/3 px-4 py-2 text-xs font-semibold text-slate-400">
            <FaEnvelope className="text-cyan-300" />
            <span className="truncate">
              Organizer Email:{" "}
              <span className="text-slate-200">
                {organizerEmail || "Not found"}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Empty */}
      {events.length === 0 && (
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 text-center shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 text-3xl text-cyan-300">
            <FaTicketAlt />
          </div>

          <h2 className="mt-6 text-2xl font-black text-white">
            No events found
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">
            You have not added any event yet.
          </p>
        </div>
      )}

      {/* Table */}
      {events.length > 0 && (
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-225 text-left">
              <thead className="border-b border-white/10 bg-white/4">
                <tr>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Event
                  </th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Category
                  </th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Location
                  </th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Date
                  </th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Price
                  </th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Seats
                  </th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {events.map((event) => (
                  <tr
                    key={event._id}
                    className="border-b border-white/10 transition hover:bg-white/4"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={event.banner}
                          alt={event.title}
                          className="h-14 w-20 rounded-xl object-cover"
                        />

                        <div>
                          <h3 className="line-clamp-1 text-sm font-bold text-white">
                            {event.title}
                          </h3>

                          <p className="mt-1 line-clamp-1 max-w-xs text-xs text-slate-500">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-300">
                      {event.category}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-cyan-300" />
                        {event.location}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-purple-300" />
                        {event.date}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm font-bold text-white">
                      ৳{event.ticketPrice}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-300">
                      {event.availableSeats}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-emerald-300">
                        {event.status || "approved"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

export default EventsPage;