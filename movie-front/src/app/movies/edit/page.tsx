import type { Metadata } from "next";
import EditMovies from "@/app/movies/edit/EditMovie";

export const metadata: Metadata = {
  title: "Movies Page",
  description: "Page where all your movie list is shown",
};

export default function CreateMoviePage() {
  return <EditMovies />;
}
