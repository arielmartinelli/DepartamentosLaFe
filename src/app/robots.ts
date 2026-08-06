import type { MetadataRoute } from "next";
import { sitio } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/ingresar", "/mis-consultas", "/crear-cuenta", "/entrar", "/recuperar"] }],
    sitemap: `${sitio.url}/sitemap.xml`,
  };
}
