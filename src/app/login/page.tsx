"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLink, AuthShell } from "@/components/account/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, Notice } from "@/components/ui/form";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Invalid credentials");
      }

      // If admin, redirect to /admin, else /account
      if (data.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/account");
      }
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <AuthShell
      title="Welcome back"
      intro="Sign in to view orders, saved addresses and your private acquisitions."
      footer={
        <>
          New to LuxeCart? <AuthLink href="/register">Create an account</AuthLink>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {error && (
          <Notice tone="warning" title="Authentication Error">
            {error}
          </Notice>
        )}

        {/* Quick Demo Pre-fills */}
        <div className="bg-beige/50 border hairline p-4 space-y-2">
          <p className="text-xs uppercase tracking-wider text-charcoal font-medium">Quick Demo Profiles</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo("customer@luxecart.com", "Customer@12345")}
              className="text-xs bg-white border hairline px-2.5 py-1.5 hover:bg-beige-deep transition-colors text-charcoal"
            >
              Demo Client (Julian Sterling)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("admin@luxecart.com", "Admin@12345")}
              className="text-xs bg-charcoal text-ivory px-2.5 py-1.5 hover:bg-charcoal/90 transition-colors"
            >
              Demo Admin (Eleanor Vance)
            </button>
          </div>
        </div>

        <Field
          label="Email Address"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <Field
          label="Password"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <div className="text-right text-sm">
          <AuthLink href="/forgot-password">Forgot password?</AuthLink>
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-ivory border-t-transparent animate-spin" />
              Verifying Credentials...
            </span>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
