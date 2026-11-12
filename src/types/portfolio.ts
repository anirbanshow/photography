export const categories = ["Portrait", "Fashion", "Landscape", "Street", "Travel", "Black & White"] as const;

export type Category = (typeof categories)[number];

export interface Photo {
  src: string;
  texture: string;
  alt: string;
  width: number;
  height: number;
}

export interface Project {
  slug: string;
  title: string;
  category: Category;
  year: string;
  location: string;
  excerpt: string;
  story: string;
  cover: Photo;
  images: Photo[];
}
