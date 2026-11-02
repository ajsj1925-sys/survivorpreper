import type { Metadata } from "next";
import { ShoppingView } from "@/components/shopping/ShoppingView";

export const metadata: Metadata = { title: "Lista de la compra" };

export default function CompraPage() {
  return <ShoppingView />;
}
