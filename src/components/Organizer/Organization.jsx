/* eslint-disable @next/next/no-img-element */
import React from "react";
import {
  FaBuilding,
  FaEdit,
  FaEnvelope,
  FaExternalLinkAlt,
  FaGlobe,
  FaTrash,
} from "react-icons/fa";

const Organization = ({ organization, onEdit, onDelete, deleting = false }) => {
  if (!organization) return null;

  const websiteUrl = organization.website?.startsWith("http")
    ? organization.website
    : `https://${organization.website}`;

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/10 backdrop-blur-xl">
      <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Logo */}
        <div className="relative min-h-[280px] bg-[#0B1120]">
          <img
            src={organization.logo}
            alt={organization.organizationName}
            className="h-full min-h-[280px] w-full object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-t from-[#080C16]/90 via-[#080C16]/10 to-transparent" />

          <span className="absolute left-5 top-5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
            {organization.status || "active"}
          </span>
        </div>

        {/* Content */}
        <div className="relative p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#7C3AED]/15 blur-[90px]" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                <FaBuilding />
                My Organization
              </div>

              <h2 className="text-3xl font-black text-white">
                {organization.organizationName}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onEdit}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-cyan-300 transition hover:bg-cyan-300/15"
                title="Edit organization"
              >
                <FaEdit />
              </button>

              <button
                type="button"
                onClick={onDelete}
                disabled={deleting}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-400/20 bg-rose-400/10 text-rose-300 transition hover:bg-rose-400/15 disabled:cursor-not-allowed disabled:opacity-60"
                title="Delete organization"
              >
                <FaTrash />
              </button>
            </div>
          </div>

          <p className="relative mt-5 text-sm leading-7 text-slate-400">
            {organization.description}
          </p>

          <div className="relative mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                <FaEnvelope className="text-cyan-300" />
                Email
              </div>

              <p className="truncate text-sm font-semibold text-slate-300">
                {organization.organizerEmail}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                <FaGlobe className="text-purple-300" />
                Website
              </div>

              {organization.website ? (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex max-w-full items-center gap-2 truncate text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
                >
                  <span className="truncate">{organization.website}</span>
                  <FaExternalLinkAlt className="shrink-0 text-xs" />
                </a>
              ) : (
                <p className="text-sm font-semibold text-slate-500">
                  Not added
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organization;