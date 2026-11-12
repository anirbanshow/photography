import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Aperture, MoveRight } from "lucide-react";
import { Hero3D } from "@/components/three/Hero3D";
import { PageMotion } from "@/components/animations/PageMotion";
import { AnimatedHeading } from "@/components/animations/AnimatedHeading";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { featuredProjects, heroFrames, projects } from "@/data/projects";
import styles from "./home.module.css";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <>
      <PageMotion />
      <section className={styles.hero} aria-label="Introduction">
        <Hero3D frames={heroFrames} />
        <div className={`shell ${styles.heroShell}`}>
          <div className={styles.heroContent}>
            <p className={`eyebrow ${styles.heroEyebrow}`}><span /> Independent photographer <span className={styles.labelDivider}>/</span> Paris, FR</p>
            <AnimatedHeading as="h1" lines={["Mira", "Solenne."]} italicLast enter className={styles.heroTitle} />
            <p className={styles.heroTagline}>Photographs of quiet things.<br />Made in available light.</p>
            <div className={styles.heroActions}>
              <MagneticButton href="/work" className="button-light">Explore work <ArrowUpRight size={17} aria-hidden="true" /></MagneticButton>
              <Link href="/gallery" className={styles.heroGallery}><Aperture size={17} strokeWidth={1.3} aria-hidden="true" /> Enter the 3D gallery</Link>
            </div>
          </div>
          <div className={styles.frameLabel} aria-hidden="true">
            <span className={styles.frameCorner} />
            <div><p>Frame 01 / Namib Desert</p><span>24°45′ S &nbsp; 15°18′ E</span></div>
          </div>
          <div className={styles.heroBottom}>
            <a href="#selected-work" className="eyebrow"><ArrowDown size={15} strokeWidth={1.5} aria-hidden="true" /> Scroll to discover</a>
            <p className="eyebrow">Portfolio <span className={styles.labelDivider}>/</span> 2023 — 2025</p>
          </div>
        </div>
      </section>

      <section id="selected-work" className={`shell ${styles.selected}`} aria-labelledby="selected-title">
        <div className={styles.sectionIndex}><span>01</span><span /> <p className="eyebrow">The portfolio</p></div>
        <div className={styles.sectionHeading}>
          <h2 id="selected-title" className="display" data-reveal>Selected <em>work.</em></h2>
          <p data-reveal>A collection of personal projects and commissioned work, gathered across cities, studios and open country.</p>
        </div>
        <div className={styles.selectedGrid}>
          {featuredProjects.map((project, index) => (
            <article className={styles.preview} key={project.slug} data-reveal>
              <Link href={`/work/${project.slug}`}>
                <div className={styles.previewImage}>
                  <Image src={project.cover.src} alt={project.cover.alt} fill sizes={index === 0 ? "(max-width: 850px) 92vw, 52vw" : "(max-width: 600px) 92vw, 34vw"} />
                  <span className={styles.previewNumber}>0{index + 1}</span>
                </div>
                <div className={styles.previewCaption}>
                  <div><p className="eyebrow">{project.category} <span>·</span> {project.year}</p><h3>{project.title}</h3></div>
                  <ArrowUpRight size={23} strokeWidth={1.2} aria-hidden="true" />
                </div>
              </Link>
            </article>
          ))}
        </div>
        <Link className="text-link" href="/work">View the full archive <MoveRight size={19} strokeWidth={1.3} aria-hidden="true" /></Link>
      </section>

      <section className={styles.exhibition} data-exhibition aria-labelledby="exhibition-title">
        <div className={styles.exhibitionImage} data-exhibition-image>
          <Image src={projects[3].cover.src} alt="" fill sizes="100vw" quality={75} />
        </div>
        <div className={`shell ${styles.exhibitionContent}`}>
          <p className="eyebrow"><span /> 02 / Virtual exhibition</p>
          <h2 id="exhibition-title" className="display">The viewing <em>room.</em></h2>
          <p>Six photographic series in a space you can move through.</p>
          <MagneticButton className="button-light" href="/gallery">Enter the 3D gallery <ArrowUpRight size={17} aria-hidden="true" /></MagneticButton>
        </div>
      </section>

      <section className={`shell ${styles.about}`} aria-labelledby="home-about-title">
        <div className={styles.aboutImage} data-reveal>
          <div data-parallax><Image src="/images/mira-solenne.webp" alt="Mira Solenne looking toward the light in a dark studio" fill sizes="(max-width: 760px) 84vw, 33vw" /></div>
          <span className="eyebrow">Studio portrait / Paris</span>
        </div>
        <div className={styles.aboutText} data-reveal>
          <div className={styles.sectionIndex}><span>03</span><span /> <p className="eyebrow">Behind the lens</p></div>
          <h2 id="home-about-title" className="display">A way of <em>looking.</em></h2>
          <p>I’m Mira, an independent photographer based in Paris. I work with the light a place gives me, and I like to stay long enough for the things people overlook to come into view.</p>
          <Link href="/about" className="text-link">About me <ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  );
}
