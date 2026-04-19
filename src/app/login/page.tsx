"use client";
import { signIn } from "next-auth/react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Lock, UserPlus, Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import * as motion from "framer-motion/client";

type AuthMode = "signin" | "signup" | "verify";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Verification
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      const errorMsg = res?.error || "";
      if (errorMsg.includes("verify your email")) {
        setError("Please verify your email first.");
        // Auto-switch to verify mode and resend code
        try {
          await fetch("/api/auth/resend-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
        } catch {}
        setMode("verify");
        startResendCooldown();
      } else {
        setError("Invalid credentials. Please check your email and password.");
      }
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account.");
        setLoading(false);
        return;
      }

      if (data.requiresVerification) {
        setMode("verify");
        startResendCooldown();
        setSuccess("Account created! Check your email for a verification code.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    const code = verificationCode.join("");
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid verification code.");
        setLoading(false);
        return;
      }

      // Auto sign-in after verification
      setSuccess("Email verified! Signing you in...");
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.ok) {
        router.push("/");
      } else {
        setSuccess("Email verified! Please sign in.");
        setMode("signin");
      }
    } catch (err: any) {
      setError(err.message || "Verification failed.");
    }
    setLoading(false);
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    try {
      await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      startResendCooldown();
      setSuccess("New verification code sent to your email!");
      setError("");
    } catch {
      setError("Failed to resend code.");
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    if (value && index < 5) {
      codeRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, key: string) => {
    if (key === "Backspace" && !verificationCode[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-500/5 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-card/60 backdrop-blur-3xl p-8 md:p-10 rounded-[2rem] border border-white/10 shadow-2xl relative z-10"
      >
        {/* Top shine line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full" />

        <div className="flex flex-col items-center mb-8 text-center">
          <motion.div
            key={mode}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 border border-primary/20"
          >
            {mode === "verify" ? (
              <ShieldCheck className="w-7 h-7 text-primary" />
            ) : mode === "signup" ? (
              <UserPlus className="w-7 h-7 text-primary" />
            ) : (
              <Lock className="w-7 h-7 text-primary" />
            )}
          </motion.div>

          <h1 className="text-3xl font-black mb-2 tracking-tight">
            {mode === "verify" ? "Verify Email" : mode === "signup" ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
            {mode === "verify"
              ? `Enter the 6-digit code sent to ${email}`
              : mode === "signup"
              ? "Sign up to share your journey with the world"
              : "Enter your credentials to access your account"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm text-center font-medium">
            {success}
          </div>
        )}

        {/* ─── VERIFY MODE ─── */}
        {mode === "verify" && (
          <div className="space-y-6">
            <div className="flex justify-center gap-3">
              {verificationCode.map((digit, i) => (
                <input
                  key={i}
                  ref={(ref) => { codeRefs.current[i] = ref; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(i, e.target.value)}
                  onKeyDown={(e) => handleCodeKeyDown(i, e.key)}
                  className={`w-12 h-14 text-center text-2xl font-black rounded-xl border-2 outline-none transition-all
                    ${digit ? "border-primary bg-primary/5" : "border-border bg-muted/50"}
                    focus:border-primary focus:ring-4 focus:ring-primary/10`}
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full h-14 bg-primary text-primary-foreground font-bold rounded-xl text-lg flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-60 shadow-lg shadow-primary/20"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>

            <div className="text-center space-y-2">
              <button
                onClick={handleResendCode}
                disabled={resendCooldown > 0}
                className={`text-sm font-semibold transition-colors ${resendCooldown > 0 ? "text-muted-foreground" : "text-primary hover:text-primary/80"}`}
              >
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend Code"}
              </button>
              <br />
              <button
                onClick={() => { setMode("signin"); setVerificationCode(["", "", "", "", "", ""]); setError(""); setSuccess(""); }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Sign In
              </button>
            </div>
          </div>
        )}

        {/* ─── SIGN IN MODE ─── */}
        {mode === "signin" && (
          <form onSubmit={handleSignIn} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  className="w-full h-13 pl-11 pr-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  className="w-full h-13 pl-11 pr-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-primary text-primary-foreground font-bold rounded-xl text-lg flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-60 shadow-lg shadow-primary/20"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button type="button" onClick={() => { setMode("signup"); setError(""); setSuccess(""); }} className="text-primary font-bold hover:text-primary/80 transition-colors">
                Sign Up
              </button>
            </p>
          </form>
        )}

        {/* ─── SIGN UP MODE ─── */}
        {mode === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">Full Name</label>
              <input
                type="text"
                className="w-full h-13 px-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">Email</label>
              <input
                type="email"
                className="w-full h-13 px-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">Password</label>
              <input
                type="password"
                className="w-full h-13 px-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">Confirm Password</label>
              <input
                type="password"
                className="w-full h-13 px-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-primary text-primary-foreground font-bold rounded-xl text-lg flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-60 shadow-lg shadow-primary/20"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button type="button" onClick={() => { setMode("signin"); setError(""); setSuccess(""); }} className="text-primary font-bold hover:text-primary/80 transition-colors">
                Sign In
              </button>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
}
