import type { Metadata } from "next";
import { BlackoutView } from "@/components/blackout/BlackoutView";

export const metadata: Metadata = { title: "Modo apagón" };

export default function ApagonPage() {
  return <BlackoutView />;
}
