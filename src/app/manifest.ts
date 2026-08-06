import type { MetadataRoute } from "next";
import { sitio } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: sitio.nombre,
    short_name: sitio.nombreCorto,
    description: sitio.descripcion,
    start_url: "/",
    display: "standalone",
    background_color: "#fbf8f3",
    theme_color: "#14161c",
    icons: [
      { src: "/icon.png", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
