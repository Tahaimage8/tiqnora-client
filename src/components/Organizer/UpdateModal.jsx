/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  FaBuilding,
  FaEdit,
  FaEnvelope,
  FaImage,
  FaTimes,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import { updateOrganization } from "@/lib/api/organization/action";

const UpdateModal = ({ organization, onUpdated }) => {
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [selectedLogo, setSelectedLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  const [formData, setFormData] = useState({
    organizationName: "",
    website: "",
    description: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!modalOpen || !organization) return;

    setSelectedLogo(null);
    setLogoPreview(organization.logo || "");

    setFormData({
      organizationName: organization.organizationName || "",
      website: organization.website || "",
      description: organization.description || "",
    });
  }, [modalOpen, organization]);

  useEffect(() => {
    if (!selectedLogo) return;

    const previewUrl = URL.createObjectURL(selectedLogo);
    setLogoPreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [selectedLogo]);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    if (updating) return;

    setModalOpen(false);
    setSelectedLogo(null);
    setLogoPreview("");
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
    setLogoPreview(organization?.logo || "");
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

  const handleUpdate = async (event) => {
    event.preventDefault();

    const organizationName = formData.organizationName.trim();
    const website = formData.website.trim();
    const description = formData.description.trim();

    if (!organization?._id) {
      toast.error("Organization id not found.");
      return;
    }

    if (!organization?.organizerEmail) {
      toast.error("Organizer email not found.");
      return;
    }

    if (!organizationName) {
      toast.error("Organization name is required.");
      return;
    }

    if (!description) {
      toast.error("Organization description is required.");
      return;
    }

    try {
      setUpdating(true);

      let logoUrl = organization.logo;

      if (selectedLogo) {
        logoUrl = await uploadImageToImageBB(selectedLogo);
      }

      const updatedData = {
        organizationName,
        logo: logoUrl,
        website,
        description,
        organizerEmail: organization.organizerEmail,
        organizerName: organization.organizerName || "Organizer",
        status: organization.status || "active",
      };

      const response = await updateOrganization(organization._id, updatedData);

      if (!response?.success) {
        toast.error(response?.message || "Organization update failed.");
        return;
      }

      onUpdated(response.data);

      toast.success(response?.message || "Organization updated successfully.");
      closeModal();
    } catch (error) {
      toast.error(error.message || "Organization update failed.");
    } finally {
      setUpdating(false);
    }
  };

  const modalContent =
    modalOpen && mounted ? (
      <div className="fixed inset-0 z-9999 flex items-center justify-center px-4 py-6">
        <button
          type="button"
          aria-label="Close update modal overlay"
          onClick={closeModal}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10000 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-white/10 bg-[#0B1120] p-6 shadow-2xl shadow-black/50 sm:p-8"
        >
          <button
            type="button"
            onClick={closeModal}
            disabled={updating}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/4 text-slate-300 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaTimes />
          </button>

          <div className="mb-7 pr-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
              <FaBuilding />
              Edit Organization
            </div>

            <h2 className="text-3xl font-black text-white">
              Update organization profile
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              Update your organization information. Email will stay connected
              with the organizer account.
            </p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Organizer Email
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-slate-300">
                <FaEnvelope className="text-cyan-300" />
                <span className="truncate">
                  {organization?.organizerEmail || "Email not found"}
                </span>
              </div>
            </div>

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
                    Replace organization logo
                  </p>

                  <p className="mt-1 text-xs leading-6 text-slate-500">
                    Choose a new logo only if you want to replace the current
                    one.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <label
                      htmlFor="updateOrganizationLogo"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-xs font-bold text-slate-300 transition hover:border-cyan-300/40 hover:bg-white/8"
                    >
                      <FaUpload />
                      Choose New Logo
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
                    id="updateOrganizationLogo"
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

            <div>
              <label
                htmlFor="updateOrganizationName"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Organization Name
              </label>

              <input
                id="updateOrganizationName"
                name="organizationName"
                type="text"
                value={formData.organizationName}
                onChange={handleChange}
                placeholder="Nova Event Studio"
                className="w-full rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
              />
            </div>

            <div>
              <label
                htmlFor="updateWebsite"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Organization Website
                <span className="ml-2 text-xs font-normal text-slate-500">
                  Optional
                </span>
              </label>

              <input
                id="updateWebsite"
                name="website"
                type="text"
                value={formData.website}
                onChange={handleChange}
                placeholder="novaevents.live"
                className="w-full rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
              />
            </div>

            <div>
              <label
                htmlFor="updateDescription"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Description
              </label>

              <textarea
                id="updateDescription"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Update your organization story, event focus, and community goals."
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
                isDisabled={updating}
                className="h-11 border border-white/10 bg-white/3 px-6 text-sm font-bold text-white"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                radius="full"
                isLoading={updating}
                className="h-11 bg-linear-to-r from-[#7C3AED] to-[#F43F5E] px-6 text-sm font-bold text-white shadow-lg shadow-purple-500/20"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    ) : null;

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-cyan-300 transition hover:bg-cyan-300/15"
        title="Edit organization"
      >
        <FaEdit />
      </button>

      {mounted && createPortal(modalContent, document.body)}
    </>
  );
};

export default UpdateModal;