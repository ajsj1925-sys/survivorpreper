import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { GUIDES, LEGACY_GUIDES } from "@/lib/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/guias", ...LEGACY_GUIDES.map((g) => `/guias/${g.slug}`), ...GUIDES.map((g) => `/guias/${g.slug}`)];
  return paths.map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : p === "/guias" ? 0.9 : 0.8,
  }));
}
