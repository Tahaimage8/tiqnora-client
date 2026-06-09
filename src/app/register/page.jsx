"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FaArrowRight,
  FaBuilding,
  FaEnvelope,
  FaGoogle,
  FaImage,
  FaLock,
  FaTrash,
  FaUpload,
  FaUser,
  FaUserAlt,
  FaUserCircle,
} from "react-icons/fa";
import Logo from "@/components/Logo";
import { authClient } from "@/lib/auth-client";

const registerSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["attendee", "organizer"]),
});

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const fadeScale = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 24,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const RegisterPage = () => {
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "attendee",
    },
  });

  const selectedRole = watch("role");

  const roles = [
    {
      id: "attendee",
      title: "Attendee",
      description: "Browse events and book tickets.",
      icon: <FaUserAlt />,
    },
    {
      id: "organizer",
      title: "Organizer",
      description: "Create and manage event listings.",
      icon: <FaBuilding />,
    },
  ];

  useEffect(() => {
    if (!selectedImage) {
      setImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(selectedImage);
    setImagePreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [selectedImage]);

  const handleImageChange = (event) => {
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

    setSelectedImage(file);
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview("");
  };

  const uploadImageToImageBB = async (imageFile) => {
    const apiKey = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;

    if (!apiKey) {
      throw new Error("Image upload API key is missing.");
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result?.success) {
      throw new Error(result?.error?.message || "Image upload failed.");
    }

    return result?.data?.display_url || result?.data?.url;
  };

  const onSubmit = async (data) => {
    try {
      let uploadedImageUrl;

      if (selectedImage) {
        toast.loading("Uploading profile image...", {
          id: "image-upload",
        });

        uploadedImageUrl = await uploadImageToImageBB(selectedImage);

        toast.success("Profile image uploaded.", {
          id: "image-upload",
        });
      }

      const { error } = await authClient.signUp.email({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        image: uploadedImageUrl || undefined,
        role: data.role,
      });

      if (error) {
        toast.error(error.message || "Registration failed. Please try again.");
        return;
      }

      toast.success("Account created successfully. Please log in.");

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setGoogleLoading(true);

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      toast.error("Google sign up failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      className="relative min-h-screen overflow-hidden bg-[#080C16] px-6 py-20 text-white"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute left-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-[#7C3AED]/25 blur-[140px]"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="absolute right-[-140px] bottom-[-120px] h-[420px] w-[420px] rounded-full bg-[#F43F5E]/15 blur-[140px]"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.25 }}
          className="absolute left-1/2 top-1/3 h-80 w-[320px] -translate-x-1/2 rounded-full bg-[#22D3EE]/10 blur-[130px]"
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />

      <div className="mx-auto grid min-h-[calc(100vh-160px)] max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left Side */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="hidden lg:block"
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.55 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300"
          >
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_#22D3EE]" />
            Join Tiqnora
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.65 }}
            className="max-w-xl text-5xl font-black leading-[1.04] tracking-tight"
          >
            Create your
            <span className="block bg-linear-to-r from-cyan-300 via-purple-400 to-rose-400 bg-clip-text text-transparent">
              event account.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.65 }}
            className="mt-6 max-w-lg text-base leading-8 text-slate-400"
          >
            Sign up as an attendee or organizer and upload a profile image that
            will be saved with your account.
          </motion.p>

          <motion.div variants={staggerContainer} className="mt-10 space-y-4">
            {[
              "ImageBB profile image upload",
              "Role saved during registration",
              "Auto login disabled after signup",
            ].map((item) => (
              <motion.div
                key={item}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 text-sm font-semibold text-slate-300"
              >
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                {item}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Register Card */}
        <motion.div
          variants={fadeScale}
          transition={{ duration: 0.75, delay: 0.15 }}
          className="mx-auto w-full max-w-xl"
        >
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/40 backdrop-blur-2xl">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="rounded-[1.5rem] border border-white/10 bg-[#0B1120] p-6 sm:p-8"
            >
              <motion.div variants={fadeUp} className="mb-8 text-center">
                <div className="mb-6 flex justify-center">
                  <Logo />
                </div>

                <h2 className="text-3xl font-black tracking-tight text-white">
                  Create your account
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Add your details, choose a role, and upload your profile
                  image.
                </p>
              </motion.div>

              {/* Image Upload Preview */}
              <motion.div
                variants={fadeUp}
                className="mb-7 flex flex-col items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] shadow-lg shadow-black/20"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-5xl text-slate-600" />
                  )}

                  <label
                    htmlFor="profileImage"
                    className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-[#0B1120] bg-linear-to-r from-[#7C3AED] to-[#F43F5E] text-xs text-white transition hover:scale-105"
                  >
                    <FaImage />
                  </label>
                </motion.div>

                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <label
                    htmlFor="profileImage"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-bold text-slate-300 transition hover:border-cyan-300/40 hover:bg-white/[0.06]"
                  >
                    <FaUpload />
                    Choose Image
                  </label>

                  {selectedImage && (
                    <button
                      type="button"
                      onClick={removeSelectedImage}
                      className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-500/15"
                    >
                      <FaTrash />
                      Remove
                    </button>
                  )}
                </div>

                {selectedImage && (
                  <p className="mt-3 max-w-xs truncate text-center text-xs text-slate-500">
                    {selectedImage.name}
                  </p>
                )}
              </motion.div>

              <motion.form
                variants={staggerContainer}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Name */}
                <motion.div variants={fadeUp}>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-300"
                  >
                    Full Name
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition focus-within:border-cyan-300/50">
                    <FaUser className="text-sm text-slate-500" />
                    <input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      {...register("name")}
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                    />
                  </div>

                  {errors.name && (
                    <p className="mt-2 text-xs font-medium text-rose-300">
                      {errors.name.message}
                    </p>
                  )}
                </motion.div>

                {/* Email */}
                <motion.div variants={fadeUp}>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-300"
                  >
                    Email Address
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition focus-within:border-cyan-300/50">
                    <FaEnvelope className="text-sm text-slate-500" />
                    <input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      {...register("email")}
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                    />
                  </div>

                  {errors.email && (
                    <p className="mt-2 text-xs font-medium text-rose-300">
                      {errors.email.message}
                    </p>
                  )}
                </motion.div>

                {/* Password */}
                <motion.div variants={fadeUp}>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-300"
                  >
                    Password
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition focus-within:border-cyan-300/50">
                    <FaLock className="text-sm text-slate-500" />
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      {...register("password")}
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                    />
                  </div>

                  {errors.password && (
                    <p className="mt-2 text-xs font-medium text-rose-300">
                      {errors.password.message}
                    </p>
                  )}
                </motion.div>

                {/* Role */}
                <motion.div variants={fadeUp}>
                  <p className="mb-3 text-sm font-semibold text-slate-300">
                    Select Role
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {roles.map((role) => (
                      <motion.button
                        key={role.id}
                        type="button"
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          setValue("role", role.id, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                          selectedRole === role.id
                            ? "border-cyan-300/50 bg-cyan-300/10 shadow-lg shadow-cyan-500/10"
                            : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                        }`}
                      >
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-cyan-300">
                          {role.icon}
                        </div>

                        <h3 className="text-sm font-bold text-white">
                          {role.title}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {role.description}
                        </p>
                      </motion.button>
                    ))}
                  </div>

                  {errors.role && (
                    <p className="mt-2 text-xs font-medium text-rose-300">
                      Please select a role.
                    </p>
                  )}
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Button
                    type="submit"
                    radius="full"
                    isLoading={isSubmitting}
                    className="h-[52px] w-full bg-linear-to-r from-[#7C3AED] to-[#F43F5E] text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition hover:-translate-y-0.5 hover:shadow-rose-500/30"
                  >
                    Create Account
                    <FaArrowRight className="ml-2 text-xs" />
                  </Button>
                </motion.div>
              </motion.form>

              <motion.div
                variants={fadeUp}
                className="my-6 flex items-center gap-4"
              >
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                  Or
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </motion.div>

              <motion.div variants={fadeUp}>
                <Button
                  type="button"
                  radius="full"
                  variant="bordered"
                  isLoading={googleLoading}
                  onPress={handleGoogleSignup}
                  className="h-12 w-full border border-white/10 bg-white/[0.03] text-sm font-bold text-white transition hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <FaGoogle className="mr-2 text-rose-400" />
                  Continue with Google
                </Button>
              </motion.div>

              <motion.p
                variants={fadeUp}
                className="mt-7 text-center text-sm text-slate-400"
              >
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-cyan-300 transition hover:text-cyan-200"
                >
                  Log In
                </Link>
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default RegisterPage;