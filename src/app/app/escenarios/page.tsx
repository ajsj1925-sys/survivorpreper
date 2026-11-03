import type { Metadata } from "next";
import { ScenariosView } from "@/components/reserves/ScenariosView";

export const metadata: Metadata = { title: "Escenarios" };

export default function Page() {
  return <ScenariosView />;
}
