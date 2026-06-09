"use client";

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
  FaEnvelope,
  FaGoogle,
  FaLock,
  FaShieldAlt,
  FaTicketAlt,
} from "react-icons/fa";
import Logo from "@/components/Logo";
import { authClient } from "@/lib/auth-client";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  rememberMe: z.boolean().optional(),
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

const LoginPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (data) => {
    try {
      const { error } = await authClient.signIn.email({
        email: data.email.trim(),
        password: data.password,
        rememberMe: data.rememberMe,
      });

      if (error) {
        toast.error(error.message || "Login failed. Please try again.");
        return;
      }

      toast.success("Logged in successfully.");

      setTimeout(() => {
        router.push("/");
      }, 800);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      toast.error("Google login failed. Please try again.");
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
          className="absolute left-1/2 top-1/3 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-[#22D3EE]/10 blur-[130px]"
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
            Welcome Back
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.65 }}
            className="max-w-xl text-5xl font-black leading-[1.04] tracking-tight"
          >
            Continue your
            <span className="block bg-linear-to-r from-cyan-300 via-purple-400 to-rose-400 bg-clip-text text-transparent">
              event journey.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.65 }}
            className="mt-6 max-w-lg text-base leading-8 text-slate-400"
          >
            Sign in to access Tiqnora event browsing, booking, and management
            tools from your account.
          </motion.p>

          <motion.div variants={staggerContainer} className="mt-10 space-y-4">
            {[
              "Email and password login",
              "Google social login",
              "Session-aware navbar",
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

        {/* Login Card */}
        <motion.div
          variants={fadeScale}
          transition={{ duration: 0.75, delay: 0.15 }}
          className="mx-auto w-full max-w-md"
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
                  Sign in to Tiqnora
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Enter your email and password to continue.
                </p>
              </motion.div>

              <motion.form
                variants={staggerContainer}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
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

                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/3 px-4 py-3 transition focus-within:border-cyan-300/50">
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

                {/* Remember Me */}
                <motion.div
                  variants={fadeUp}
                  className="flex items-center justify-between gap-4"
                >
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-400">
                    <input
                      type="checkbox"
                      {...register("rememberMe")}
                      className="h-4 w-4 rounded border-white/10 bg-white/[0.03] accent-cyan-300"
                    />
                    Remember me
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
                  >
                    Forgot password?
                  </Link>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Button
                    type="submit"
                    radius="full"
                    isLoading={isSubmitting}
                    className="h-[52px] w-full bg-linear-to-r from-[#7C3AED] to-[#F43F5E] text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition hover:-translate-y-0.5 hover:shadow-rose-500/30"
                  >
                    Sign In
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
                  onPress={handleGoogleLogin}
                  className="h-12 w-full border border-white/10 bg-white/[0.03] text-sm font-bold text-white transition hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <FaGoogle className="mr-2 text-rose-400" />
                  Continue with Google
                </Button>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex items-start gap-3">
                  <FaShieldAlt className="mt-0.5 text-sm text-cyan-300" />
                  <p className="text-xs leading-5 text-slate-500">
                    Your session will be handled through Better Auth after a
                    successful login.
                  </p>
                </div>
              </motion.div>

              <motion.p
                variants={fadeUp}
                className="mt-7 text-center text-sm text-slate-400"
              >
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-bold text-cyan-300 transition hover:text-cyan-200"
                >
                  Sign Up
                </Link>
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default LoginPage;