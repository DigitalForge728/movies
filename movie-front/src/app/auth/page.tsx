import type { Metadata } from "next";
import Auth from "@/app/auth/Auth";

export const metadata: Metadata = {
  title: "Auth",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthPage() {
  return <Auth />;
}
