import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/guias/kit-emergencia-72-horas", "/guias/cuanta-agua-almacenar"].map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.8,
  }));
}
