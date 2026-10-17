import type { Metadata } from "next";
import { ContentPage, Section } from "@/components/ui/content-page";

export const metadata: Metadata = {
  title: "About",
  description: "LuxeCart is a premium multi-category marketplace built as a full-stack engineering portfolio project.",
};

export default function AboutPage() {
  return (
    <ContentPage
      title="About LuxeCart"
      eyebrow="Our story"
      intro="LuxeCart pairs a restrained, editorial shopping experience with a carefully engineered full-stack commerce platform."
    >
      <Section title="What we believe">
        <p>
          Good shopping is quiet. Fewer, better objects. Honest descriptions, clear prices and a checkout that never
          surprises you. LuxeCart curates five departments — fashion, electronics, home, beauty and lifestyle — around
          that idea.
        </p>
      </Section>
      <Section title="About this project">
        <p>
          LuxeCart is a developer portfolio project. It is built with Next.js, TypeScript, PostgreSQL and Prisma, with
          server-side validation, secure sessions and sandbox payments being added phase by phase. Orders placed on a
          development deployment are never fulfilled and sandbox payments never move real money.
        </p>
      </Section>
    </ContentPage>
  );
}
