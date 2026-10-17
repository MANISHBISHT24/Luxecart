import type { Metadata } from "next";
import { ContentPage } from "@/components/ui/content-page";
import { Button } from "@/components/ui/button";
import { Field, Notice, TextArea } from "@/components/ui/form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the LuxeCart team.",
};

export default function ContactPage() {
  return (
    <ContentPage title="Contact" eyebrow="Help" intro="Questions about an order, a product or your account? Send us a note.">
      <Notice tone="warning" title="Not connected yet">
        The message form is built but has no email or ticketing backend, so sending is disabled. A validated,
        rate-limited submission endpoint is added with the backend work.
      </Notice>
      <form className="grid gap-5 sm:grid-cols-2" noValidate>
        <Field label="Name" id="name" autoComplete="name" disabled />
        <Field label="Email" id="email" type="email" autoComplete="email" disabled />
        <TextArea label="Message" id="message" className="sm:col-span-2" disabled />
        <Button type="submit" disabled className="sm:w-fit">
          Send message
        </Button>
      </form>
    </ContentPage>
  );
}
