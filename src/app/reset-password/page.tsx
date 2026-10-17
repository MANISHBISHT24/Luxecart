import type { Metadata } from "next";
import { AuthLink, AuthShell } from "@/components/account/auth-shell";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/form";

export const metadata: Metadata = { title: "Choose a new password", robots: { index: false } };

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="New password"
      intro="Choose a strong password you don't use anywhere else."
      footer={<AuthLink href="/login">Back to sign in</AuthLink>}
    >
      <form className="space-y-5" noValidate>
        <Field label="New password" id="password" type="password" autoComplete="new-password" hint="At least 10 characters." disabled />
        <Field label="Confirm password" id="confirm" type="password" autoComplete="new-password" disabled />
        <Button type="submit" size="lg" className="w-full" disabled>
          Update password
        </Button>
      </form>
    </AuthShell>
  );
}
