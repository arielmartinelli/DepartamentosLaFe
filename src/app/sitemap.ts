import type { MetadataRoute } from "next";
import { departamentos } from "@/lib/data";
import { sitio } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();
  return [
    { url: sitio.url, lastModified: ahora, changeFrequency: "weekly", priority: 1 },
    ...departamentos.map((d) => ({
      url: `${sitio.url}/departamentos/${d.slug}`,
      lastModified: ahora,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
