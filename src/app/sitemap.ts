import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/work", "/gallery", "/about", "/contact", ...projects.map(({ slug }) => `/work/${slug}`)];
  return paths.map((path) => ({ url: new URL(path, siteUrl).href }));
}
