import type { MetadataRoute } from "next";
import { departamentos } from "@/lib/data";
import { urlBase } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();
  const base = urlBase();
  return [
    { url: base, lastModified: ahora, changeFrequency: "weekly", priority: 1 },
    ...departamentos.map((d) => ({
      url: `${base}/departamentos/${d.slug}`,
      lastModified: ahora,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
