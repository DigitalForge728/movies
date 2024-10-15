import type { Metadata } from "next";
import Movies from "@/app/movies/Movies";

export const metadata: Metadata = {
  title: "Movies Page",
  description: "Page where all your movie list is shown",
};

export default function MoviesPage() {
  return <Movies />;
}
