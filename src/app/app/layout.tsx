import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { ExpiryReminder } from "@/components/ExpiryReminder";
import { PageTransition } from "@/components/PageTransition";
import { ProNudge } from "@/components/ProNudge";

export const metadata: Metadata = {
  title: "Mi panel",
  robots: { index: false }, // el panel privado no se indexa; el SEO va en / y /guias
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <Sidebar />
      <ProNudge />
      <main className="px-4 pb-28 pt-6 md:ml-60 md:px-8 md:pb-10 md:pt-8 print:m-0 print:p-0">
        <div className="mx-auto max-w-5xl">
          <ExpiryReminder />
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
    </div>
  );
}
