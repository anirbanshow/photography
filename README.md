# Mira Solenne Photography

A cinematic photography portfolio built with Next.js 16.4.6 and the App Router. Mira Solenne is a fictional independent photographer. The biography, projects, dates, imagery, and studio details are sample content.

## Architecture

| Path | Role |
| --- | --- |
| `src/app` | Home, 3D gallery, archive, six statically generated project pages, About, Contact, metadata, and the contact API |
| `src/components/layout` | Navigation, fullscreen menu, and footer |
| `src/components/animations` | Lenis, GSAP ScrollTrigger, line reveals, route entrances, and scroll progress |
| `src/components/three` | Lazy React Three Fiber scenes, pointer and keyboard controls, and HTML fallbacks |
| `src/components/gallery` | Archive cards, filters, project viewer, and accessible fullscreen lightbox |
| `src/components/sections` | Studio pages and the inquiry form |
| `src/data/projects.ts` | Typed project records, featured work, and hero frames |
| `public/images` | Optimized WebP photographs and reduced-size gallery textures |

Next.js and React render the pages, Tailwind supplies the base styles, and CSS modules handle each composition. The gallery uses Three.js, React Three Fiber, and Drei. GSAP owns scroll effects, Lenis drives smooth scrolling, and Motion handles small interface transitions. The inquiry form uses React Hook Form and Zod, with Resend behind a server-only route.

## Local setup

Use Node.js 22 or newer with npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

In PowerShell, use `Copy-Item .env.example .env.local` to copy the environment file. Open [the local site](http://localhost:3000). Photography, navigation, and the gallery work before email credentials are configured.

```sh
npm run typecheck
npm run lint
npm run build
npm start
```

## Configure email and site metadata

Set these in `.env.local` for development and in the deployment provider’s environment settings for production.

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical HTTPS origin for metadata, robots, and the sitemap |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Studio email displayed on the site |
| `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_BEHANCE_URL` | Full URLs for the studio’s real profiles |
| `RESEND_API_KEY` | Resend key with permission to send email |
| `CONTACT_FROM_EMAIL` | A sender at a domain verified in Resend, such as `Studio <inquiries@yourdomain.com>` |
| `CONTACT_TO_EMAIL` | Inbox that should receive inquiries |

The contact route validates input and request size, checks a honeypot, and sends plain-text inquiries with the visitor as Reply-To. It uses a submission key to avoid duplicate delivery on retries. The sample `.example` address is reserved and cannot receive email.

## Replace the sample work

1. Place your WebP images in `public/images`. Export a second copy of each gallery cover at up to 768 px on the longest side into `public/images/textures`.
2. Update each project in `src/data/projects.ts` with the source paths, actual image dimensions, descriptive alt text, and editorial copy. The `slug` becomes the public URL. The archive, gallery, and sitemap read from the same data.
3. Update the featured projects and hero frames at the bottom of the data file. The first hero frame should be a wide photograph with enough contrast behind the left-aligned title. Update the caption in `src/app/page.tsx` to match.
4. Replace the studio portrait, brand, sample biography, email, social links, and site metadata before publishing.

### Sample image provenance

The bundled photos were generated for this demo using OpenAI image generation. They are synthetic portfolio placeholders. The briefs covered a solitary figure on bronze Namib dunes at dusk, intimate portraits in window light, a fashion study in brutalist concrete, rainy Tokyo streets and trains, terracotta architecture in the Atlas Mountains, monochrome concrete forms, and a studio portrait of the fictional photographer. Each project contains a cover and a companion image.

## Deploy

Deploy the project as a Next.js application to Vercel, or build and run it on a Node.js host with `npm ci`, `npm run build`, and `npm start`. A Node-capable runtime is required for the contact API and Next.js image optimization. Configure production environment variables before building, then check a project URL directly and send a test inquiry to your configured inbox.

## Gallery controls

Drag or swipe horizontally, or use the previous and next buttons. With the gallery stage focused, use the arrow keys to browse, Home and End to jump, and Enter to open the project. Reduced-motion preferences and unavailable WebGL switch the gallery to ordinary HTML photos with the same navigation.
