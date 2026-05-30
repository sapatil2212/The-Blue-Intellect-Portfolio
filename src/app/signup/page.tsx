"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, AlertCircle, User, Eye, EyeOff } from "lucide-react";
import { signupAction, checkAuthAction, sendOtpAction } from "@/actions/auth";
import GradientCard from "@/components/ui/GradientCard";
import Link from "next/link";
import { cn } from "@/lib/utils";

const credentialsSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").optional().or(z.literal("")),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(5, "Password must be at least 5 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type CredentialsSchemaValues = z.infer<typeof credentialsSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // OTP Flow States
  const [stage, setStage] = useState<"credentials" | "otp">("credentials");
  const [savedData, setSavedData] = useState<CredentialsSchemaValues | null>(null);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if already authenticated and redirect to /admin
    checkAuthAction().then((authenticated) => {
      if (authenticated) {
        router.push("/admin");
      } else {
        setIsChecking(false);
      }
    });
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CredentialsSchemaValues>({
    resolver: zodResolver(credentialsSchema),
  });

  // Stage 1: Validate credentials and send OTP
  const onCredentialsSubmit = async (data: CredentialsSchemaValues) => {
    setIsSubmitting(true);
    setAuthError(null);

    const res = await sendOtpAction(data.email);

    if (res.success) {
      setSavedData(data);
      setStage("otp");
      setIsSubmitting(false);
    } else {
      setAuthError(res.error || "Failed to send verification code. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Stage 2: Verify OTP and create user
  const onOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!savedData) return;
    if (otpValue.trim().length !== 6) {
      setOtpError("Please enter the 6-digit verification code");
      return;
    }

    setIsSubmitting(true);
    setOtpError(null);

    const res = await signupAction({
      email: savedData.email,
      name: savedData.name || undefined,
      password: savedData.password,
      otp: otpValue,
    });

    if (res.success) {
      router.push("/admin");
    } else {
      setOtpError(res.error || "Verification failed. Please check the code.");
      setIsSubmitting(false);
    }
  };

  // Resend OTP Code
  const handleResendOtp = async () => {
    if (!savedData) return;
    setResendStatus("sending");
    setOtpError(null);

    const res = await sendOtpAction(savedData.email);

    if (res.success) {
      setResendStatus("sent");
      setTimeout(() => setResendStatus("idle"), 5000); // Reset status after 5s
    } else {
      setResendStatus("error");
      setOtpError(res.error || "Failed to resend verification code");
    }
  };

  if (isChecking) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-neutral-50/50 dark:bg-neutral-950/50">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <p className="text-xs text-neutral-400 font-semibold tracking-wider mt-4">Verifying Credentials...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 relative overflow-hidden bg-neutral-50/50 dark:bg-neutral-950/20">
      
      {/* Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/3 h-72 w-72 bg-blue-300/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 h-72 w-72 bg-indigo-300/10 rounded-full blur-3xl animate-pulse [animation-delay:2.5s]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md my-8">
        
        {/* Logo and title */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-semibold uppercase tracking-wider border border-blue-500/15 dark:border-blue-400/15 mb-2">
            <ShieldCheck className="h-3.5 w-3.5 fill-blue-500/20" />
            <span>Secure Access Gateway</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
            {stage === "credentials" ? "Create Admin Profile" : "Verify Email Address"}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {stage === "credentials" 
              ? "Register below to obtain access to the The Blue Intellect project management dashboard." 
              : `A verification code has been sent to ${savedData?.email}.`
            }
          </p>
        </div>

        <GradientCard glowColor="rgba(59, 130, 246, 0.05)" className="p-6 md:p-8">
          {stage === "credentials" ? (
            // STAGE 1: Standard Credentials
            <form onSubmit={handleSubmit(onCredentialsSubmit)} className="space-y-4">
              
              {/* Error alerts */}
              <AnimatePresence>
                {authError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl p-3 flex items-start gap-2.5 overflow-hidden"
                  >
                    <AlertCircle className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
                    <span className="text-[11px] text-rose-700 dark:text-rose-350 font-medium leading-relaxed">
                      {authError}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold tracking-tight text-neutral-800 dark:text-neutral-200 block">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    placeholder="Alex Mercer"
                    {...register("name")}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-neutral-100/60 dark:bg-neutral-950/75 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-neutral-900 transition-all ${
                      errors.name
                        ? "border-rose-300 focus:ring-rose-100/50"
                        : "border-neutral-300 dark:border-neutral-700/80 focus:border-blue-500 focus:ring-blue-100/50 dark:focus:ring-blue-900/30"
                    }`}
                  />
                  <User className="absolute left-4 top-3.5 h-4 w-4 text-neutral-400" />
                </div>
                {errors.name && (
                  <p className="text-xs text-rose-500 font-semibold">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold tracking-tight text-neutral-800 dark:text-neutral-200 block">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@theblueintellect.com"
                    {...register("email")}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-neutral-100/60 dark:bg-neutral-950/75 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-neutral-900 transition-all ${
                      errors.email
                        ? "border-rose-300 focus:ring-rose-100/50"
                        : "border-neutral-300 dark:border-neutral-700/80 focus:border-blue-500 focus:ring-blue-100/50 dark:focus:ring-blue-900/30"
                    }`}
                  />
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-neutral-400" />
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-500 font-semibold">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold tracking-tight text-neutral-800 dark:text-neutral-200 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className={`w-full pl-11 pr-11 py-3 rounded-xl border bg-neutral-100/60 dark:bg-neutral-950/75 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-neutral-900 transition-all ${
                      errors.password
                        ? "border-rose-300 focus:ring-rose-100/50"
                        : "border-neutral-300 dark:border-neutral-700/80 focus:border-blue-500 focus:ring-blue-100/50 dark:focus:ring-blue-900/30"
                    }`}
                  />
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-neutral-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-rose-500 font-semibold">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-semibold tracking-tight text-neutral-800 dark:text-neutral-200 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    className={`w-full pl-11 pr-11 py-3 rounded-xl border bg-neutral-100/60 dark:bg-neutral-950/75 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-neutral-900 transition-all ${
                      errors.confirmPassword
                        ? "border-rose-300 focus:ring-rose-100/50"
                        : "border-neutral-300 dark:border-neutral-700/80 focus:border-blue-500 focus:ring-blue-100/50 dark:focus:ring-blue-900/30"
                    }`}
                  />
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-neutral-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-3.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-rose-500 font-semibold">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit to Send OTP */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative group h-12 bg-linear-to-r from-sky-400 via-sky-500 to-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden disabled:opacity-75 disabled:pointer-events-none cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      <span>Sending Verification Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send OTP Code</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            // STAGE 2: OTP Verification
            <form onSubmit={onOtpSubmit} className="space-y-5">
              
              {/* Error alerts */}
              <AnimatePresence>
                {otpError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl p-3 flex items-start gap-2.5 overflow-hidden"
                  >
                    <AlertCircle className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
                    <span className="text-[11px] text-rose-700 dark:text-rose-350 font-medium leading-relaxed">
                      {otpError}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* OTP Input Field */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold tracking-tight text-neutral-800 dark:text-neutral-200 block">
                    Verification Code
                  </label>
                  <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
                    6 Digits
                  </span>
                </div>
                <div className="relative flex justify-between gap-2 max-w-[320px] mx-auto py-2 cursor-pointer" onClick={() => inputRef.current?.focus()}>
                  {/* Hidden Input */}
                  <input
                    ref={inputRef}
                    id="otp"
                    type="text"
                    maxLength={6}
                    pattern="\d*"
                    inputMode="numeric"
                    value={otpValue}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 6) {
                        setOtpValue(val);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                    autoComplete="one-time-code"
                  />
                  
                  {/* Animated Boxes */}
                  {Array.from({ length: 6 }).map((_, index) => {
                    const char = otpValue[index] || "";
                    const isActive = index === otpValue.length && isFocused;
                    const isFilled = char !== "";
                    
                    return (
                      <div
                        key={index}
                        className={cn(
                          "w-11 h-14 rounded-xl border flex items-center justify-center text-lg font-bold transition-all duration-200 select-none relative",
                          isActive
                            ? "border-blue-500 bg-white dark:bg-neutral-900 ring-2 ring-blue-100 dark:ring-blue-900/30 scale-105 shadow-sm"
                            : isFilled
                            ? "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                            : "border-neutral-300 dark:border-neutral-700/80 bg-neutral-100/60 dark:bg-neutral-950/75 text-neutral-400"
                        )}
                      >
                        {/* Digit or Placeholder */}
                        <AnimatePresence mode="popLayout">
                          {char ? (
                            <motion.span
                              key={char}
                              initial={{ opacity: 0, y: 10, scale: 0.8 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -10, scale: 0.8 }}
                              transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            >
                              {char}
                            </motion.span>
                          ) : (
                            <span key="empty" className="text-neutral-300 dark:text-neutral-700 font-normal">
                              -
                            </span>
                          )}
                        </AnimatePresence>

                        {/* Blinking Cursor Caret */}
                        {isActive && (
                          <motion.div
                            className="absolute w-0.5 h-6 bg-blue-600 rounded-full"
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit & Register */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative group h-12 bg-linear-to-r from-sky-400 via-sky-500 to-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden disabled:opacity-75 disabled:pointer-events-none cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      <span>Verifying & Creating Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Complete Registration</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>

              {/* Actions & Resend */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setStage("credentials")}
                  className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-semibold transition-colors cursor-pointer"
                >
                  ← Change Details
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendStatus === "sending"}
                  className="text-blue-600 hover:text-blue-550 font-bold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {resendStatus === "idle" && "Resend Code"}
                  {resendStatus === "sending" && "Sending..."}
                  {resendStatus === "sent" && "Code Sent!"}
                  {resendStatus === "error" && "Error, retry"}
                </button>
              </div>
            </form>
          )}
        </GradientCard>
        
        {/* Return to login/home links */}
        <div className="flex flex-col items-center gap-4 mt-6">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-500 font-bold transition-colors">
              Log in
            </Link>
          </p>
          <a href="/" className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
            ← Return to Home
          </a>
        </div>

      </div>
    </div>
  );
}
