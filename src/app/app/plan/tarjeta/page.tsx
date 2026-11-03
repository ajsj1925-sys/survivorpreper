import type { Metadata } from "next";
import { PlanCards } from "@/components/plan/PlanCards";

export const metadata: Metadata = { title: "Tarjeta del plan familiar" };

export default function PlanCardPage() {
  return <PlanCards />;
}
