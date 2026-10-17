import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { SignInRequired } from "@/components/account/sign-in-required";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/form";
import { MapPin, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = { title: "Address Book | LuxeCart" };

export default async function AddressesPage() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-display">Address Book</h2>
        <SignInRequired what="saved addresses" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display">Saved Addresses</h2>
        <p className="text-sm text-ink-soft mt-1">Manage delivery locations for swift, white-glove checkouts.</p>
      </div>

      <div className="border hairline bg-white p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-charcoal" />
            <span className="eyebrow">Primary Residence</span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            Default
          </span>
        </div>
        <div className="text-sm text-ink-soft leading-relaxed">
          <p className="font-medium text-charcoal">{session.name}</p>
          <p>12 Rosewood Lane, Suite 4B</p>
          <p>Indiranagar, Bengaluru, Karnataka 560038</p>
          <p>Phone: +91 98765 43210</p>
        </div>
      </div>

      <div className="border hairline bg-white p-6 sm:p-8 space-y-6">
        <h3 className="eyebrow">Add Supplementary Location</h3>
        <form className="grid max-w-2xl gap-5 sm:grid-cols-2" noValidate>
          <Field label="Recipient Name" id="a-name" defaultValue={session.name} className="sm:col-span-2" />
          <Field label="Address Line 1" id="a-line1" placeholder="Street address or estate" className="sm:col-span-2" />
          <Field label="City" id="a-city" placeholder="e.g. Mumbai" />
          <Field label="PIN Code" id="a-pin" placeholder="e.g. 400001" />
          <Button type="button" className="sm:col-span-2 sm:w-fit">
            Save Address
          </Button>
        </form>
      </div>
    </div>
  );
}
