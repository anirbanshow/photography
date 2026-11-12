import Link from "next/link";
import { ArrowUpRight, MoveUp } from "lucide-react";
import { Brand } from "./Brand";
import { contactEmail } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-call">
          <p className="eyebrow"><span /> Available for commissions</p>
          <div className="footer-head">
            <h2 className="display">Let’s make<br /><em>something.</em></h2>
            <Link href="/contact" className="footer-round" aria-label="Book a shoot"><ArrowUpRight size={39} strokeWidth={1} /></Link>
          </div>
          {contactEmail.endsWith(".example")
            ? <span>{contactEmail}</span>
            : <a className="footer-email" href={`mailto:${contactEmail}`}>{contactEmail}</a>}
        </div>
        <div className="footer-bottom">
          <Brand />
          <p>© {new Date().getFullYear()} Mira Solenne</p>
          <a className="back-to-top" href="#main">Back to top <MoveUp size={13} aria-hidden="true" /></a>
        </div>
      </div>
    </footer>
  );
}
