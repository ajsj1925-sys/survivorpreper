import type { Metadata } from "next";
import { EnergyView } from "@/components/reserves/EnergyView";

export const metadata: Metadata = { title: "Luz, energía y cocina" };

export default function Page() {
  return <EnergyView />;
}
