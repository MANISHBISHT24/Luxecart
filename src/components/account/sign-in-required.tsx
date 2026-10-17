import { LogIn } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Notice } from "@/components/ui/form";

/** Shown wherever signed-in data will appear once authentication exists. */
export function SignInRequired({ what }: { what: string }) {
  return (
    <div className="space-y-6">
      <Notice tone="warning" title="Sign-in is not connected yet">
        Your {what} will appear here once you are signed in. Authentication and account data are built in a later phase;
        no placeholder or fake data is shown.
      </Notice>
      <div className="flex flex-col items-start gap-5 border border-dashed border-beige-deep bg-white/60 p-8">
        <LogIn className="h-7 w-7 stroke-[1.3]" aria-hidden />
        <div className="flex gap-3">
          <ButtonLink href="/login">Sign in</ButtonLink>
          <ButtonLink href="/register" variant="secondary">
            Create account
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
