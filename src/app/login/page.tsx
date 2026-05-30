"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff, KeyRound, CheckCircle2 } from "lucide-react";
import { loginAction, checkAuthAction, sendForgotPasswordOtpAction, resetPasswordAction } from "@/actions/auth";
import GradientCard from "@/components/ui/GradientCard";
import Link from "next/link";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

type LoginSchemaValues = z.infer<typeof loginSchema>;

// ─── Forgot Password Modal ────────────────────────────────────────────────────
function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [stage, setStage] = useState<"email" | "otp" | "reset" | "done">("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent">("idle");
  const otpInputRef = useRef<HTMLInputElement>(null);

  const handleSendOtp = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    setIsLoading(true);
    const res = await sendForgotPasswordOtpAction(email);
    setIsLoading(false);
    if (res.success) {
      setStage("otp");
    } else {
      setEmailError(res.error || "Failed to send code");
    }
  };

  const handleResend = async () => {
    setResendStatus("sending");
    const res = await sendForgotPasswordOtpAction(email);
    setResendStatus(res.success ? "sent" : "idle");
    if (res.success) setTimeout(() => setResendStatus("idle"), 5000);
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) {
      setOtpError("Enter the 6-digit code");
      return;
    }
    setOtpError("");
    setStage("reset");
  };

  const handleReset = async () => {
    if (newPassword.length < 5) {
      setPasswordError("Password must be at least 5 characters");
      return;
    }
    if (newPassword !== repeatPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordError("");
    setIsLoading(true);
    const res = await resetPasswordAction(email, otpValue, newPassword);
    setIsLoading(false);
    if (res.success) {
      setStage("done");
    } else {
      setPasswordError(res.error || "Reset failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6"
      >
        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/30 mb-3">
            <KeyRound className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
            {stage === "email" && "Forgot Password"}
            {stage === "otp" && "Check Your Email"}
            {stage === "reset" && "Set New Password"}
            {stage === "done" && "Password Reset!"}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {stage === "email" && "Enter your email to receive a reset code."}
            {stage === "otp" && `We sent a 6-digit code to ${email}`}
            {stage === "reset" && "Enter and confirm your new password."}
            {stage === "done" && "Your password has been updated successfully."}
          </p>
        </div>

        {/* Stage: Email */}
        {stage === "email" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  placeholder="you@example.com"
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-neutral-50 dark:bg-neutral-950/75 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-all",
                    emailError
                      ? "border-rose-300 focus:ring-rose-100/50"
                      : "border-neutral-300 dark:border-neutral-700 focus:border-blue-500 focus:ring-blue-100/50 dark:focus:ring-blue-900/30"
                  )}
                />
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              </div>
              {emailError && <p className="text-xs text-rose-500 font-semibold">{emailError}</p>}
            </div>
            <button
              onClick={handleSendOtp}
              disabled={isLoading}
              className="w-full h-10 bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:pointer-events-none"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send Reset Code <ArrowRight className="h-4 w-4" /></>}
            </button>
          </div>
        )}

        {/* Stage: OTP */}
        {stage === "otp" && (
          <div className="space-y-4">
            {otpError && (
              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl p-2.5 flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                <span className="text-[11px] text-rose-700 font-medium">{otpError}</span>
              </div>
            )}
            <div
              className="relative flex justify-between gap-2 cursor-pointer py-1"
              onClick={() => otpInputRef.current?.focus()}
            >
              <input
                ref={otpInputRef}
                type="text"
                maxLength={6}
                inputMode="numeric"
                value={otpValue}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.length <= 6) setOtpValue(val);
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                autoComplete="one-time-code"
                autoFocus
              />
              {Array.from({ length: 6 }).map((_, i) => {
                const char = otpValue[i] || "";
                const isActive = i === otpValue.length && isFocused;
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 h-12 rounded-xl border flex items-center justify-center text-base font-bold transition-all duration-200 relative",
                      isActive
                        ? "border-blue-500 bg-white dark:bg-neutral-900 ring-2 ring-blue-100 dark:ring-blue-900/30 scale-105"
                        : char
                        ? "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                        : "border-neutral-300 dark:border-neutral-700/80 bg-neutral-100/60 dark:bg-neutral-950/75 text-neutral-400"
                    )}
                  >
                    <AnimatePresence mode="popLayout">
                      {char ? (
                        <motion.span
                          key={char + i}
                          initial={{ opacity: 0, y: 8, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.8 }}
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        >
                          {char}
                        </motion.span>
                      ) : (
                        <span className="text-neutral-300 dark:text-neutral-700 font-normal text-sm">-</span>
                      )}
                    </AnimatePresence>
                    {isActive && (
                      <motion.div
                        className="absolute w-0.5 h-5 bg-blue-600 rounded-full"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <button
              onClick={handleVerifyOtp}
              className="w-full h-10 bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Verify Code <ArrowRight className="h-4 w-4" />
            </button>
            <div className="flex items-center justify-between text-xs">
              <button onClick={() => setStage("email")} className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 font-semibold transition-colors">
                ← Change Email
              </button>
              <button
                onClick={handleResend}
                disabled={resendStatus === "sending"}
                className="text-blue-600 font-bold hover:text-blue-500 transition-colors disabled:opacity-50"
              >
                {resendStatus === "idle" && "Resend Code"}
                {resendStatus === "sending" && "Sending..."}
                {resendStatus === "sent" && "Sent!"}
              </button>
            </div>
          </div>
        )}

        {/* Stage: Reset Password */}
        {stage === "reset" && (
          <div className="space-y-3">
            {passwordError && (
              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl p-2.5 flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                <span className="text-[11px] text-rose-700 font-medium">{passwordError}</span>
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-sm bg-neutral-50 dark:bg-neutral-950/75 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-100/50 dark:focus:ring-blue-900/30 transition-all"
                />
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Repeat Password</label>
              <div className="relative">
                <input
                  type={showRepeat ? "text" : "password"}
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReset()}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-sm bg-neutral-50 dark:bg-neutral-950/75 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-100/50 dark:focus:ring-blue-900/30 transition-all"
                />
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                <button type="button" onClick={() => setShowRepeat(!showRepeat)} className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                  {showRepeat ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button
              onClick={handleReset}
              disabled={isLoading}
              className="w-full h-10 bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:pointer-events-none mt-1"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Reset Password <ArrowRight className="h-4 w-4" /></>}
            </button>
          </div>
        )}

        {/* Stage: Done */}
        {stage === "done" && (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 dark:bg-green-950/30">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">You can now log in with your new password.</p>
            <button
              onClick={onClose}
              className="w-full h-10 bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Back to Login
            </button>
          </div>
        )}

        {/* Close button */}
        {stage !== "done" && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        )}
      </motion.div>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  useEffect(() => {
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
  } = useForm<LoginSchemaValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchemaValues) => {
    setIsSubmitting(true);
    setAuthError(null);
    const res = await loginAction(data.email, data.password);
    if (res.success) {
      router.push("/admin");
    } else {
      setAuthError(res.error || "Authentication failed");
      setIsSubmitting(false);
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
      <div className="absolute top-1/4 left-1/3 h-72 w-72 bg-blue-300/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 h-72 w-72 bg-indigo-300/10 rounded-full blur-3xl animate-pulse [animation-delay:2.5s]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-semibold uppercase tracking-wider border border-blue-500/15 dark:border-blue-400/15 mb-2">
            <ShieldCheck className="h-3.5 w-3.5 fill-blue-500/20" />
            <span>Secure Access</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">Admin Gateway</h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Log in to manage The Blue Intellect portfolio projects and view metrics.</p>
        </div>

        <GradientCard glowColor="rgba(59, 130, 246, 0.05)" className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <AnimatePresence>
              {authError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl p-3 flex items-start gap-2.5 overflow-hidden"
                >
                  <AlertCircle className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
                  <span className="text-[11px] text-rose-700 dark:text-rose-350 font-medium leading-relaxed">{authError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold tracking-tight text-neutral-800 dark:text-neutral-200 block">
                Admin Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="admin@theblueintellect.com"
                  {...register("email")}
                  className={cn(
                    "w-full pl-11 pr-4 py-3 rounded-xl border bg-neutral-100/60 dark:bg-neutral-950/75 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-neutral-900 transition-all",
                    errors.email
                      ? "border-rose-300 focus:ring-rose-100/50"
                      : "border-neutral-300 dark:border-neutral-700/80 focus:border-blue-500 focus:ring-blue-100/50 dark:focus:ring-blue-900/30"
                  )}
                />
                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-neutral-400" />
              </div>
              {errors.email && <p className="text-xs text-rose-500 font-semibold">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold tracking-tight text-neutral-800 dark:text-neutral-200">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-[11px] text-blue-600 hover:text-blue-500 font-semibold transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={cn(
                    "w-full pl-11 pr-11 py-3 rounded-xl border bg-neutral-100/60 dark:bg-neutral-950/75 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-neutral-900 transition-all",
                    errors.password
                      ? "border-rose-300 focus:ring-rose-100/50"
                      : "border-neutral-300 dark:border-neutral-700/80 focus:border-blue-500 focus:ring-blue-100/50 dark:focus:ring-blue-900/30"
                  )}
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
              {errors.password && <p className="text-xs text-rose-500 font-semibold">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative group h-12 bg-linear-to-r from-sky-400 via-sky-500 to-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden disabled:opacity-75 disabled:pointer-events-none cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Verifying Identity...</span>
                  </>
                ) : (
                  <>
                    <span>Unlock Dashboard</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        </GradientCard>

        <div className="flex flex-col items-center gap-4 mt-6">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:text-blue-500 font-bold transition-colors">
              Sign up
            </Link>
          </p>
          <a href="/" className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
            ← Return to Home
          </a>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
      </AnimatePresence>
    </div>
  );
}
