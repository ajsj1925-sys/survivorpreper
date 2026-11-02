import type { Metadata } from "next";
import { KitView } from "@/components/kit/KitView";

export const metadata: Metadata = { title: "Kit 72 h" };

export default function KitPage() {
  return <KitView />;
}
