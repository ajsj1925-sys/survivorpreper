import type { Metadata } from "next";
import { ReservesView } from "@/components/reserves/ReservesView";

export const metadata: Metadata = { title: "Reservas" };

export default function Page() {
  return <ReservesView />;
}
