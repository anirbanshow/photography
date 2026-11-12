import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageMotion } from "@/components/animations/PageMotion";
import { ContactForm } from "@/components/sections/ContactForm";
import { projects } from "@/data/projects";
import { contactEmail, siteName } from "@/lib/site";
import styles from "@/components/sections/studio.module.css";

const description = "Get in touch with Mira Solenne’s Paris photography studio for commissions, collaborations, prints, and licensing.";
const { src, alt } = projects[0].cover;

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title: `Contact — ${siteName}`, description, url: "/contact", siteName, images: [{ url: src, alt }] },
};

const sampleEmail = contactEmail.endsWith(".example");

const socials = [
  { name: "Instagram", profile: process.env.NEXT_PUBLIC_INSTAGRAM_URL },
  { name: "Behance", profile: process.env.NEXT_PUBLIC_BEHANCE_URL },
].filter(({ profile }) => profile);

export default function ContactPage() {
  return (
    <div className={`shell ${styles.page} ${styles.contact}`}>
      <PageMotion />
      <section className={styles.contactIntro} aria-labelledby="contact-title">
        <p className="eyebrow"><span className={styles.dot} /> Available for commissions</p>
        <h1 className={styles.heading} id="contact-title">
          Let’s make<br /><em>something.</em>
        </h1>
        <p className={styles.contactLede}>
          Tell me what you have in mind. I’m always interested in new people, places, and ways of seeing.
        </p>

        <dl className={styles.contacts}>
          <div>
            <dt>Email</dt>
            <dd>{sampleEmail ? contactEmail : <a href={`mailto:${contactEmail}`}>{contactEmail}<ArrowUpRight size={14} aria-hidden="true" /></a>}</dd>
          </div>
          <div>
            <dt>Based in</dt>
            <dd>Paris, France · Available worldwide</dd>
          </div>
          {socials.length > 0 && <div>
            <dt>Elsewhere</dt>
            <dd className={styles.socials}>
              {socials.map(({ name, profile }) => (
                <a href={profile} key={name}>
                  {name}<ArrowUpRight size={14} aria-hidden="true" />
                </a>
              ))}
            </dd>
          </div>}
        </dl>
      </section>
      <ContactForm />
    </div>
  );
}
