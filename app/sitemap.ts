import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://mintai.in",
      lastModified: new Date(),
    },
    {
      url: "https://mintai.in/blog",
      lastModified: new Date(),
    },
    {
      url: "https://mintai.in/store",
      lastModified: new Date(),
    },
    {
      url: "https://mintai.in/about",
      lastModified: new Date(),
    },
    {
      url: "https://mintai.in/contact",
      lastModified: new Date(),
    },
  ];
}