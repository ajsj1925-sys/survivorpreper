import type { Metadata } from "next";
import { HomeView } from "@/components/home/HomeView";

export const metadata: Metadata = { title: "Inicio" };

export default function AppHome() {
  return <HomeView />;
}
