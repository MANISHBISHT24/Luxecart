import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-12", className)} {...props} />;
}

export function Badge({
  tone = "light",
  className,
  ...props
}: ComponentProps<"span"> & { tone?: "light" | "dark" | "outline" }) {
  const tones = {
    light: "bg-white text-charcoal",
    dark: "bg-charcoal text-ivory",
    outline: "border border-charcoal/30 text-charcoal",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.16em]",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "items-center text-center sm:flex-col sm:items-center",
      )}
    >
      <div className={cn("max-w-xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <Tag className="text-4xl sm:text-5xl">{title}</Tag>
        {description && <p className="mt-4 text-ink-soft">{description}</p>}
      </div>
      {action}
    </div>
  );
}
