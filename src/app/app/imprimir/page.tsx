import type { Metadata } from "next";
import { KitPrint } from "@/components/print/KitPrint";

export const metadata: Metadata = { title: "Lista del kit para imprimir" };

export default function PrintKitPage() {
  return <KitPrint />;
}
