import type { MetadataRoute } from "next";
import { urlBase } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/ingresar", "/mis-consultas", "/crear-cuenta", "/entrar", "/recuperar"] }],
    sitemap: `${urlBase()}/sitemap.xml`,
  };
}
