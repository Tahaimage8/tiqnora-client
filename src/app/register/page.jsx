"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { toast } from "sonner";
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
  FaUser,
  FaUserAlt,
  FaUserCircle,
} from "react-icons/fa";
import Logo from "@/components/Logo";
import { authClient } from "@/lib/auth-client";

const registerSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  image: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => {
        if (!value) return true;
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Please enter a valid image URL." }
    ),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["attendee", "organizer"], {
    message: "Please select a role.",
  }),
});

const RegisterPage = () => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
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
      image: "",
      password: "",
      role: "attendee",
    },
  });

  const imageUrl = watch("image");
  const selectedRole = watch("role");

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

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

  const onSubmit = async (data) => {
    try {
      const { error } = await authClient.signUp.email({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        image: data.image?.trim() || undefined,

        /*
          Better Auth server config e role additional field support korle
          nicher line uncomment korte paro:
          role: data.role,
        */

        callbackURL: "/login",
      });

      if (error) {
        toast.error(error.message || "Registration failed. Please try again.");
        return;
      }

      toast.success("Account created successfully.");
      router.push("/login");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
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

  const hasImagePreview = imageUrl?.trim() && !imageError;

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#080C16] px-6 py-20 text-white">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-[#7C3AED]/25 blur-[140px]" />
        <div className="absolute right-[-140px] bottom-[-120px] h-[420px] w-[420px] rounded-full bg-[#F43F5E]/15 blur-[140px]" />
        <div className="absolute left-1/2 top-1/3 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-[#22D3EE]/10 blur-[130px]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />

      <div className="mx-auto grid min-h-[calc(100vh-160px)] max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left Side */}
        <div className="hidden lg:block">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_#22D3EE]" />
            Join Tiqnora
          </div>

          <h1 className="max-w-xl text-5xl font-black leading-[1.04] tracking-tight">
            Create your
            <span className="block bg-linear-to-r from-cyan-300 via-purple-400 to-rose-400 bg-clip-text text-transparent">
              event account.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-slate-400">
            Sign up as an attendee or organizer and start using Tiqnora’s event
            booking interface.
          </p>

          <div className="mt-10 space-y-4">
            {[
              "Clean registration interface",
              "Profile image preview",
              "React Hook Form validation",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-sm font-semibold text-slate-300"
              >
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Register Card */}
        <div className="mx-auto w-full max-w-xl">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/40 backdrop-blur-2xl">
            <div className="rounded-[1.5rem] border border-white/10 bg-[#0B1120] p-6 sm:p-8">
              <div className="mb-8 text-center">
                <div className="mb-6 flex justify-center">
                  <Logo />
                </div>

                <h2 className="text-3xl font-black tracking-tight text-white">
                  Create your account
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Add your details and preview your profile image before signing
                  up.
                </p>
              </div>

              {/* Image Preview */}
              <div className="mb-7 flex justify-center">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] shadow-lg shadow-black/20">
                  {hasImagePreview ? (
                    <img
                      src={imageUrl}
                      alt="Profile preview"
                      onError={() => setImageError(true)}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-5xl text-slate-600" />
                  )}

                  <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0B1120] bg-linear-to-r from-[#7C3AED] to-[#F43F5E] text-xs text-white">
                    <FaImage />
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name */}
                <div>
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
                </div>

                {/* Email */}
                <div>
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
                </div>

                {/* Image */}
                <div>
                  <label
                    htmlFor="image"
                    className="mb-2 block text-sm font-semibold text-slate-300"
                  >
                    Profile Image URL
                    <span className="ml-2 text-xs font-normal text-slate-500">
                      Optional
                    </span>
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition focus-within:border-cyan-300/50">
                    <FaImage className="text-sm text-slate-500" />
                    <input
                      id="image"
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      {...register("image")}
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                    />
                  </div>

                  {errors.image && (
                    <p className="mt-2 text-xs font-medium text-rose-300">
                      {errors.image.message}
                    </p>
                  )}

                  {imageUrl && imageError && (
                    <p className="mt-2 text-xs font-medium text-rose-300">
                      Image preview failed. Please use a valid direct image URL.
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
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
                </div>

                {/* Role */}
                <div>
                  <p className="mb-3 text-sm font-semibold text-slate-300">
                    Select Role
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setValue("role", role.id)}
                        className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                          selectedRole === role.id
                            ? "border-cyan-300/50 bg-cyan-300/10"
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
                      </button>
                    ))}
                  </div>

                  {errors.role && (
                    <p className="mt-2 text-xs font-medium text-rose-300">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  radius="full"
                  isLoading={isSubmitting}
                  className="h-13 w-full bg-linear-to-r from-[#7C3AED] to-[#F43F5E] text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition hover:-translate-y-0.5 hover:shadow-rose-500/30"
                >
                  Create Account
                  <FaArrowRight className="ml-2 text-xs" />
                </Button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                  Or
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <Button
                type="button"
                radius="full"
                variant="bordered"
                isLoading={googleLoading}
                onPress={handleGoogleSignup}
                className="h-12 w-full border border-white/10 bg-white/3 text-sm font-bold text-white transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                <FaGoogle className="mr-2 text-rose-400" />
                Continue with Google
              </Button>

              <p className="mt-7 text-center text-sm text-slate-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-cyan-300 transition hover:text-cyan-200"
                >
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;