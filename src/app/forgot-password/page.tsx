import type { Metadata } from "next";
import { AuthLink, AuthShell } from "@/components/account/auth-shell";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/form";

export const metadata: Metadata = { title: "Reset your password", robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset password"
      intro="Enter your email and we'll send a reset link if an account exists."
      footer={<AuthLink href="/login">Back to sign in</AuthLink>}
    >
      <form className="space-y-5" noValidate>
        <Field label="Email" id="email" type="email" autoComplete="email" disabled />
        <Button type="submit" size="lg" className="w-full" disabled>
          Send reset link
        </Button>
      </form>
    </AuthShell>
  );
}
