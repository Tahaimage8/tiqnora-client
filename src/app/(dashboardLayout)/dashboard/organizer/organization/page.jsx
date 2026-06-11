/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Organization from "@/components/Organizer/Organization";

import {
  FaBuilding,
  FaEnvelope,
  FaImage,
  FaPlusCircle,
  FaTimes,
  FaTrash,
  FaUpload,
} from "react-icons/fa";

import {
  addOrganization,
  getMyOrganization,
} from "@/lib/api/organization/action";

const OrganizationPage = () => {
  const { data: session, isPending } = authClient.useSession();

  const organizerEmail = session?.user?.email || "";
  const organizerName = session?.user?.name || "Organizer";

  const [organization, setOrganization] = useState(null);
  const [fetchingOrganization, setFetchingOrganization] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [selectedLogo, setSelectedLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  const [formData, setFormData] = useState({
    organizationName: "",
    website: "",
    description: "",
  });

  // Load logged-in organizer's organization
  useEffect(() => {
    if (isPending) return;

    if (!organizerEmail) {
      setFetchingOrganization(false);
      return;
    }

    const loadMyOrganization = async () => {
      try {
        setFetchingOrganization(true);

        const response = await getMyOrganization(organizerEmail);

        if (response?.success) {
          setOrganization(response.data || null);
        }
      } catch (error) {
        toast.error(error.message || "Failed to load organization.");
      } finally {
        setFetchingOrganization(false);
      }
    };

    loadMyOrganization();
  }, [isPending, organizerEmail]);

  // Logo preview
  useEffect(() => {
    if (!selectedLogo) {
      setLogoPreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(selectedLogo);
    setLogoPreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [selectedLogo]);

  const openCreateModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    if (creating) return;

    setModalOpen(false);
    setSelectedLogo(null);
    setLogoPreview("");
    setFormData({
      organizationName: "",
      website: "",
      description: "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Image size must be under 5MB.");
      return;
    }

    setSelectedLogo(file);
  };

  const removeLogo = () => {
    setSelectedLogo(null);
    setLogoPreview("");
  };

  const uploadImageToImageBB = async (imageFile) => {
    const apiKey = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;

    if (!apiKey) {
      throw new Error("Image upload API key is missing.");
    }

    const imageData = new FormData();
    imageData.append("image", imageFile);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: imageData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result?.success) {
      throw new Error(result?.error?.message || "Logo upload failed.");
    }

    return result?.data?.display_url || result?.data?.url;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const organizationName = formData.organizationName.trim();
    const website = formData.website.trim();
    const description = formData.description.trim();

    if (!organizerEmail) {
      toast.error("Organizer email not found. Please login again.");
      return;
    }

    if (!organizationName) {
      toast.error("Organization name is required.");
      return;
    }

    if (!selectedLogo) {
      toast.error("Organization logo is required.");
      return;
    }

    if (!description) {
      toast.error("Organization description is required.");
      return;
    }

    try {
      setCreating(true);

      const logoUrl = await uploadImageToImageBB(selectedLogo);

      const newOrganization = {
        organizationName,
        logo: logoUrl,
        website,
        description,
        organizerEmail,
        organizerName,
        status: "active",
      };

      const response = await addOrganization(newOrganization);

      if (!response?.success) {
        toast.error(response?.message || "Organization creation failed.");
        return;
      }

      setOrganization(response.data);

      toast.success(response?.message || "Organization created successfully.");
      closeModal();
    } catch (error) {
      toast.error(error.message || "Organization creation failed.");
    } finally {
      setCreating(false);
    }
  };

  if (isPending || fetchingOrganization) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-3xl border border-white/10 bg-white/4 px-6 py-4 text-sm font-semibold text-slate-300">
          Loading organization profile...
        </div>
      </div>
    );
  }

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

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_#22D3EE]" />
              Organization Settings
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              My Organization
              <span className="block bg-linear-to-r from-cyan-300 via-purple-400 to-rose-400 bg-clip-text text-transparent">
                Profile.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              Create and manage your organization profile. Your organizer email
              will be attached automatically from your logged-in session.
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

          {!organization && (
            <Button
              type="button"
              radius="full"
              onPress={openCreateModal}
              className="h-12 w-full bg-linear-to-r from-[#7C3AED] to-[#F43F5E] px-6 text-sm font-bold text-white shadow-lg shadow-purple-500/25 sm:w-fit"
            >
              <FaPlusCircle className="mr-2" />
              Create Organization
            </Button>
          )}
        </div>
      </motion.div>

      {/* Empty State */}
      {!organization && (
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 text-center shadow-2xl shadow-black/10 backdrop-blur-xl"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 text-3xl text-cyan-300">
            <FaBuilding />
          </div>

          <h2 className="mt-6 text-2xl font-black text-white">
            No organization found
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">
            You have not created an organization profile yet. Create one now to
            start managing event listings under your organization.
          </p>

          <Button
            type="button"
            radius="full"
            onPress={openCreateModal}
            className="mt-7 h-12 bg-linear-to-r from-[#7C3AED] to-[#F43F5E] px-7 text-sm font-bold text-white shadow-lg shadow-purple-500/25"
          >
            <FaPlusCircle className="mr-2" />
            Create Your Organization
          </Button>
        </motion.div>
      )}

      {/* Organization Card */}
      {organization && (
        <Organization
          organization={organization}
          onUpdated={setOrganization}
          onDelete={() =>
            toast.info("Delete option will be added in DELETE step.")
          }
        />
      )}

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4 py-6">
          <button
            type="button"
            aria-label="Close modal overlay"
            onClick={closeModal}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-white/10 bg-[#0B1120] p-6 shadow-2xl shadow-black/40 sm:p-8"
          >
            <button
              type="button"
              onClick={closeModal}
              disabled={creating}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/4 text-slate-300 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaTimes />
            </button>

            <div className="mb-7 pr-12">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                <FaBuilding />
                Create Your Organization
              </div>

              <h2 className="text-3xl font-black text-white">
                Create your organization
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                Add your organization name, logo, website, and description.
                Organizer email will be attached automatically.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Organizer Email Readonly */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Organizer Email
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-slate-300">
                  <FaEnvelope className="text-cyan-300" />
                  <span className="truncate">
                    {organizerEmail || "Session email not found"}
                  </span>
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-300">
                  Organization Logo
                </p>

                <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/3 p-4 sm:flex-row sm:items-center">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#080C16] text-3xl text-slate-600">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FaImage />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">
                      Upload organization logo
                    </p>

                    <p className="mt-1 text-xs leading-6 text-slate-500">
                      PNG, JPG, or WEBP. Maximum file size 5MB.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <label
                        htmlFor="organizationLogo"
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-xs font-bold text-slate-300 transition hover:border-cyan-300/40 hover:bg-white/8"
                      >
                        <FaUpload />
                        Choose Logo
                      </label>

                      {selectedLogo && (
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-500/15"
                        >
                          <FaTrash />
                          Remove
                        </button>
                      )}
                    </div>

                    <input
                      id="organizationLogo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />

                    {selectedLogo && (
                      <p className="mt-3 max-w-sm truncate text-xs text-slate-500">
                        {selectedLogo.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Organization Name */}
              <div>
                <label
                  htmlFor="organizationName"
                  className="mb-2 block text-sm font-semibold text-slate-300"
                >
                  Organization Name
                </label>

                <input
                  id="organizationName"
                  name="organizationName"
                  type="text"
                  value={formData.organizationName}
                  onChange={handleChange}
                  placeholder="Nova Event Studio"
                  className="w-full rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
                />
              </div>

              {/* Website */}
              <div>
                <label
                  htmlFor="website"
                  className="mb-2 block text-sm font-semibold text-slate-300"
                >
                  Organization Website
                  <span className="ml-2 text-xs font-normal text-slate-500">
                    Optional
                  </span>
                </label>

                <input
                  id="website"
                  name="website"
                  type="text"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="novaevents.live"
                  className="w-full rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-slate-300"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Building memorable event experiences through workshops, meetups, cultural programs, and community gatherings."
                  rows={5}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  radius="full"
                  variant="bordered"
                  onPress={closeModal}
                  isDisabled={creating}
                  className="h-11 border border-white/10 bg-white/3 px-6 text-sm font-bold text-white"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  radius="full"
                  isLoading={creating}
                  className="h-11 bg-linear-to-r from-[#7C3AED] to-[#F43F5E] px-6 text-sm font-bold text-white shadow-lg shadow-purple-500/20"
                >
                  Create Organization
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default OrganizationPage;