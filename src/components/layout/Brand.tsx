import Link from "next/link";

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Mira Solenne home">
      <svg viewBox="0 0 36 36" width="32" height="32" fill="none" aria-hidden="true">
        <circle cx="18" cy="18" r="14" stroke="currentColor" opacity=".46" />
        <path d="M18 4v28M4 18h28M8.1 8.1l19.8 19.8m0-19.8L8.1 27.9" stroke="currentColor" strokeWidth=".9" />
        <circle cx="18" cy="18" r="2.75" fill="currentColor" />
      </svg>
      <span>Mira Solenne<span>Photography</span></span>
    </Link>
  );
}
