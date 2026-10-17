"use client";

import "./globals.css";

/** Last-resort boundary when the root layout itself fails. Must render <html>/<body>. */
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh items-center justify-center bg-ivory px-6 text-center text-charcoal">
        <div role="alert" className="max-w-md">
          <h1 className="font-serif text-5xl">Something went wrong</h1>
          <p className="mt-4 text-[#655f58]">A critical error occurred. Please try again.</p>
          {error.digest && <p className="mt-2 text-xs text-[#655f58]">Reference: {error.digest}</p>}
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="mt-8 h-12 bg-charcoal px-8 text-sm uppercase tracking-widest text-ivory"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
