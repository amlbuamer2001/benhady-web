import type { MetadataRoute } from "next";

/** Lets phones install the site to the home screen and open it full-screen like an app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "بن هادي لتأجير السيارات",
    short_name: "بن هادي",
    start_url: "/ar",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#76c419",
    dir: "rtl",
    lang: "ar",
    icons: [{ src: "/images/logo.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
