import type { Photo, Project } from "@/types/portfolio";
export { categories } from "@/types/portfolio";

function photo(name: string, alt: string, width = 764, height = 508): Photo {
  return { src: `/images/${name}.webp`, texture: `/images/textures/${name}.webp`, alt, width, height };
}

export const projects: Project[] = [
  {
    slug: "the-shape-of-silence",
    title: "The Shape of Silence",
    category: "Landscape",
    year: "2025",
    location: "Namib Desert, Namibia",
    excerpt: "An encounter with scale, solitude and the last light on the dunes.",
    story: "At the edge of the Namib, the wind draws over its own work. What looks from a distance like an unchanging landscape is being redrawn by the minute. The camera follows the thin boundary between light and shadow, leaving a single figure to measure the distance.",
    cover: photo("dune-hero", "A lone figure on a sweeping bronze dune at dusk", 1672, 941),
    images: [photo("dune-02", "Late light tracing the crest of a dune above a field of patterned sand")],
  },
  {
    slug: "between-breaths",
    title: "Between Breaths",
    category: "Portrait",
    year: "2025",
    location: "Paris, France",
    excerpt: "A portrait study in the space between gestures.",
    story: "These photographs were made beside a single window, with the portrait set by the rhythm of passing light. Over the course of the sitting the distance between pose and gesture narrowed. A turned head or a closed eye became enough to hold the frame.",
    cover: photo("portrait-01", "A woman with closed eyes and a thin band of sunlight across her face"),
    images: [photo("portrait-02", "A woman in profile with her hand at her throat in a shadowed room")],
  },
  {
    slug: "borrowed-geometry",
    title: "Borrowed Geometry",
    category: "Fashion",
    year: "2024",
    location: "Marseille, France",
    excerpt: "A study in tailoring and the hard lines of concrete.",
    story: "A black coat and a concrete stairwell provided the elements for this series. As the light moved across the building, the hard shadows became another piece of the styling. The smallest shift of the body could undo the symmetry and bring the whole composition to life.",
    cover: photo("fashion-01", "A model in a black coat against a concrete wall cut by diagonal shadow"),
    images: [photo("fashion-02", "A model in profile walking up a bare concrete staircase")],
  },
  {
    slug: "after-the-rain",
    title: "After the Rain",
    category: "Street",
    year: "2025",
    location: "Tokyo, Japan",
    excerpt: "The city seen in puddles, windows and passing silhouettes.",
    story: "Rain turns the street into a second sky. In these late evening photographs the city is made legible through reflected light, an umbrella entering the frame, or a figure held for a moment in a train window. Each frame was composed around the brief pause before something moved.",
    cover: photo("street-01", "A figure with an umbrella in a rain-soaked Tokyo lane at night"),
    images: [photo("street-02", "A figure near a train window catching reflections on a rainy evening")],
  },
  {
    slug: "earth-and-ochre",
    title: "Earth & Ochre",
    category: "Travel",
    year: "2024",
    location: "Atlas Mountains, Morocco",
    excerpt: "An early morning walk through rooms and walls the color of the land.",
    story: "Morning light gives these earthen walls a tone that changes as you walk past. The photographs follow a path through a courtyard, an arch and a flight of worn steps, collecting details that are easiest to see before the day gets busy.",
    cover: photo("travel-01", "A figure walking beneath an arch in a clay-colored kasbah"),
    images: [photo("travel-02", "Sunlight across earthen steps beside a woven textile")],
  },
  {
    slug: "studies-in-grey",
    title: "Studies in Grey",
    category: "Black & White",
    year: "2023",
    location: "Lyon, France",
    excerpt: "Concrete forms revealed by a narrow measure of light.",
    story: "A curved wall can look flat until the light travels far enough to graze its edge. Working in monochrome let me follow those changes closely, through surfaces that become almost abstract and stairs that retain just enough detail to suggest a place.",
    cover: photo("mono-01", "Two curved concrete forms edged by light in a black and white photograph"),
    images: [photo("mono-02", "Angular monochrome stairwell with sunlight falling across the landing")],
  },
];

export const featuredProjects = [projects[0], projects[1], projects[3]];
export const heroFrames = [projects[0].cover, projects[1].cover, projects[2].cover];
