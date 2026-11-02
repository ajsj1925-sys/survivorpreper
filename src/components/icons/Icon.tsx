import type { Tone } from "@/lib/catalog";
import { PH } from "./ph-data";

/** Icono Phosphor duotono. Hereda el color del texto (currentColor). */
export function Icon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      dangerouslySetInnerHTML={{ __html: PH[name] ?? PH.package }}
    />
  );
}

// Clases completas (Tailwind solo genera las que ve escritas)
export const TONE: Record<Tone, string> = {
  sky: "bg-sky-50 text-sky-600 ring-sky-100",
  amber: "bg-amber-50 text-amber-600 ring-amber-100",
  rose: "bg-rose-50 text-rose-600 ring-rose-100",
  yellow: "bg-yellow-50 text-yellow-600 ring-yellow-100",
  violet: "bg-violet-50 text-violet-600 ring-violet-100",
  slate: "bg-slate-100 text-slate-600 ring-slate-200",
  indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  teal: "bg-teal-50 text-teal-600 ring-teal-100",
  orange: "bg-orange-50 text-orange-600 ring-orange-100",
  stone: "bg-stone-100 text-stone-600 ring-stone-200",
};

const SIZES = {
  xs: { box: "h-8 w-8 rounded-xl", icon: "h-5 w-5" },
  sm: { box: "h-10 w-10 rounded-xl", icon: "h-6 w-6" },
  md: { box: "h-12 w-12 rounded-2xl", icon: "h-7 w-7" },
  lg: { box: "h-14 w-14 rounded-2xl", icon: "h-8 w-8" },
  xl: { box: "h-20 w-20 rounded-3xl", icon: "h-12 w-12" },
};

/** Icono dentro de una baldosa de color suave: la pieza visual básica de la app. */
export function IconTile({
  name,
  tone = "stone",
  size = "md",
  className = "",
}: {
  name: string;
  tone?: Tone;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <span className={`inline-flex shrink-0 items-center justify-center ring-1 ${s.box} ${TONE[tone]} ${className}`}>
      <Icon name={name} className={s.icon} />
    </span>
  );
}
