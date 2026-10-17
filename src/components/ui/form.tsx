import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";

const inputBase =
  "block w-full h-12 bg-white border border-line px-4 text-[0.95rem] text-charcoal placeholder:text-muted transition-colors focus:border-charcoal focus:outline-none focus-visible:outline-none focus:ring-1 focus:ring-charcoal aria-[invalid=true]:border-danger";

export function Field({
  label,
  id,
  hint,
  error,
  className,
  ...props
}: Omit<ComponentProps<"input">, "id"> & { label: string; id: string; hint?: string; error?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={props.name ?? id}
        className={inputBase}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...props}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-soft">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextArea({
  label,
  id,
  className,
  ...props
}: Omit<ComponentProps<"textarea">, "id"> & { label: string; id: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <textarea id={id} name={props.name ?? id} className={cn(inputBase, "h-auto min-h-32 py-3")} {...props} />
    </div>
  );
}

export function SelectField({
  label,
  id,
  className,
  children,
  ...props
}: Omit<ComponentProps<"select">, "id"> & { label: string; id: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <select id={id} name={props.name ?? id} className={cn(inputBase, "appearance-none pr-10")} {...props}>
        {children}
      </select>
    </div>
  );
}

export function Notice({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warning";
  title?: string;
  children: ReactNode;
}) {
  return (
    <div
      role="status"
      className={cn(
        "border px-4 py-3 text-sm",
        tone === "info" ? "border-line bg-beige/40" : "border-[#d9b98a] bg-[#f6ead7]",
      )}
    >
      {title && <p className="mb-0.5 font-medium">{title}</p>}
      <div className="text-ink-soft">{children}</div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-beige-deep bg-white/50 px-6 py-20 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-beige text-charcoal" aria-hidden>
        {icon}
      </div>
      <h2 className="text-3xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-ink-soft">{description}</p>
      {actionHref && actionLabel && (
        <ButtonLink href={actionHref} className="mt-8">
          {actionLabel}
        </ButtonLink>
      )}
    </div>
  );
}
