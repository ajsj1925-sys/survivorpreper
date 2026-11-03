import type { Metadata } from "next";
import { WaterView } from "@/components/reserves/WaterView";

export const metadata: Metadata = { title: "Agua" };

export default function Page() {
  return <WaterView />;
}
