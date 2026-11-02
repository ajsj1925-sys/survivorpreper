import type { Metadata } from "next";
import { PantryView } from "@/components/pantry/PantryView";

export const metadata: Metadata = { title: "Despensa" };

export default function DespensaPage() {
  return <PantryView />;
}
