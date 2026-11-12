import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="shell status-page">
      <p className="eyebrow">Error 404</p>
      <h1 className="display">Out of frame.</h1>
      <p>This photograph or page may have moved.</p>
      <Link className="text-link" href="/work">Return to the archive <ArrowUpRight size={16} /></Link>
    </section>
  );
}
