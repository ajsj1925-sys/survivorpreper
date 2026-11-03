import type { Metadata } from "next";
import { MenuView } from "@/components/reserves/MenuView";

export const metadata: Metadata = { title: "Menú de emergencia" };

export default function Page() {
  return <MenuView />;
}
