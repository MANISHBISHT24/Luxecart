import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { SignInRequired } from "@/components/account/sign-in-required";
import { Button } from "@/components/ui/button";
import { Field, Notice } from "@/components/ui/form";

export const metadata: Metadata = { title: "Profile Preferences | LuxeCart" };

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-display">Client Profile</h2>
        <SignInRequired what="profile details" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display">Client Preferences</h2>
        <p className="text-sm text-ink-soft mt-1">Manage personal credentials and concierge notifications.</p>
      </div>

      <Notice tone="info" title="Verified Account">
        Your credentials are encrypted. Changes update your session across all devices.
      </Notice>

      <form className="max-w-lg space-y-5 border hairline bg-white p-6 sm:p-8" noValidate>
        <Field label="Full Name" id="name" defaultValue={session.name} required />
        <Field label="Email Address" id="email" type="email" defaultValue={session.email} disabled />
        <Field label="Contact Phone" id="phone" type="tel" defaultValue="+91 98765 43210" />
        <Field label="Account Tier" id="role" defaultValue={session.role} disabled />
        <Button type="button" size="md">
          Save Preferences
        </Button>
      </form>
    </div>
  );
}
