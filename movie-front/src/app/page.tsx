import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movies",
  description: "Movies App",
};

export default function Home() {
  return <main className="flex flex-col items-center justify-between" />;
}
