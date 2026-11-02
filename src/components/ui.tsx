import type { ButtonHTMLAttributes, ReactNode } from "react";

export function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

type Variant = "primary" | "secondary" | "ghost" | "danger";

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const styles: Record<Variant, string> = {
    primary: "bg-brand-500 text-white hover:bg-brand-600",
    secondary: "border border-stone-300 bg-white text-stone-800 hover:bg-stone-100",
    ghost: "text-stone-600 hover:bg-stone-100",
    danger: "text-red-600 hover:bg-red-50",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-stone-200 bg-white p-5 shadow-sm", className)}>
      {children}
    </div>
  );
}

export function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("flex flex-col gap-1 text-xs font-medium text-stone-600", className)}>
      {label}
      {children}
    </label>
  );
}

export function Stat({
  label,
  value,
  sub,
  tone = "default",
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "good" | "warn" | "bad";
  icon?: ReactNode;
}) {
  const tones = {
    default: "text-stone-900",
    good: "text-emerald-700",
    warn: "text-amber-600",
    bad: "text-red-600",
  };
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-stone-500">
        {icon}
        {label}
      </div>
      <div className={cn("mt-1 text-2xl font-semibold tabular-nums", tones[tone])}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-stone-500">{sub}</div>}
    </Card>
  );
}

export function PageHeader({ title, desc, actions }: { title: string; desc?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {desc && <p className="mt-1 text-sm text-stone-600">{desc}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
