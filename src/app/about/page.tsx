import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { PageMotion } from "@/components/animations/PageMotion";
import styles from "@/components/sections/studio.module.css";

const description = "Meet Mira Solenne, an independent photographer based in Paris working across editorial, portraiture, and landscape.";
const portrait = "/images/mira-solenne.webp";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Mira Solenne",
    description,
    url: "/about",
    images: [{ url: portrait, alt: "Portrait of photographer Mira Solenne" }],
  },
};

const services = [
  { name: "Editorial & fashion", detail: "Stories for publications, independent labels, and creative teams." },
  { name: "Portraiture", detail: "Intimate, considered photographs of artists and people at work." },
  { name: "Travel & landscape", detail: "Fieldwork, location commissions, and visual essays about place." },
  { name: "Prints & licensing", detail: "Limited-edition prints and licensing from the photographic archive." },
];

const milestones = [
  { date: "2016", title: "Independent practice", detail: "First commissioned editorial portraits in Paris." },
  { date: "2021", title: "Field studies", detail: "Started a continuing archive of remote coastal and alpine landscapes." },
  { date: "2025", title: "Collected prints", detail: "Released a first limited edition from the landscape archive." },
];

export default function AboutPage() {
  return (
    <div className={`shell ${styles.page} ${styles.about}`}>
      <PageMotion />
      <section className={styles.aboutIntro} aria-labelledby="about-title">
        <div className={styles.aboutTitle}>
          <p className="eyebrow"><span className={styles.dot} /> Behind the lens</p>
          <h1 className={styles.heading} id="about-title">Mira<br /><em>Solenne.</em></h1>
          <p className={styles.contactLede}>Independent photographer working between portraiture, fashion, and the natural world.</p>
          <a href="#practice" className={styles.downLink}><ArrowDown size={16} aria-hidden="true" /> The practice</a>
        </div>

        <figure className={styles.aboutFigure}>
          <div className={styles.portraitFrame}>
            <Image src={portrait} width={404} height={505}
              sizes="(max-width: 700px) 90vw, (max-width: 1200px) 43vw, 560px"
              alt="Mira Solenne in a brown jacket looking off-camera against a dark backdrop"
              data-parallax preload />
          </div>
          <figcaption className={styles.caption}><span>Fig. 01 — Mira Solenne</span><span>Paris, France</span></figcaption>
        </figure>
      </section>

      <section className={styles.practice} id="practice" aria-labelledby="practice-title" data-reveal>
        <p className="eyebrow">01 / The practice</p>
        <div>
          <h2 id="practice-title" className={styles.sectionHeading}>I make photographs<br />to <em>pay attention.</em></h2>
          <div className={styles.bio}>
            <p>
              I’m drawn to what happens at the edge of a scene. The pause between gestures.
              The light just before it changes. I work slowly whenever I can, leaving room for
              the people and places in front of me to alter the picture I thought I was going to make.
            </p>
            <p>
              A decade of independent work has taken me from small editorial sets to extended
              field assignments. I work with natural light, film, and digital formats.
              My ongoing landscape studies and limited-edition print releases grow out of that same practice.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.practice} aria-labelledby="services-title" data-reveal>
        <p className="eyebrow">02 / In the studio</p>
        <div>
          <h2 id="services-title" className={styles.sectionHeading}>Ways to <em>work together.</em></h2>
          <ul className={styles.services}>
            {services.map(({ name, detail }, index) => (
              <li key={name}>
                <span aria-hidden="true">0{index + 1}</span>
                <h3>{name}</h3>
                <p>{detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.practice} aria-labelledby="milestones-title" data-reveal>
        <p className="eyebrow">03 / Selected milestones</p>
        <div>
          <h2 id="milestones-title" className={styles.sectionHeading}>A practice <em>in progress.</em></h2>
          <ol className={styles.services}>
            {milestones.map(({ date, title, detail }) => (
              <li key={date}>
                <span><time dateTime={date}>{date}</time></span>
                <h3>{title}</h3>
                <p>{detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.aboutCta} data-reveal aria-label="Studio inquiries">
        <p className="eyebrow"><span className={styles.dot} /> Open for new projects</p>
        <Link href="/contact" className={styles.ctaLink}>Start a <em>conversation.</em><ArrowUpRight aria-hidden="true" /></Link>
      </section>
    </div>
  );
}
