"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="shell status-page">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="display">Frame interrupted.</h1>
      <p>The page couldn’t finish loading.</p>
      <button className="text-link" onClick={reset}>Try again</button>
      <Link className="text-link" href="/">Return home</Link>
    </section>
  );
}
