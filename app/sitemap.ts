import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mintai.in";

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/store`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
    },
  ];

  const { data: blogs } = await supabase
    .from("blogs")
    .select("slug, created_at");

  const blogUrls =
    blogs?.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.created_at),
    })) || [];

  const { data: products } = await supabase
  .from("products")
  .select("link_slug, created_at")
  .not("link_slug", "is", null);

  const productUrls =
  products?.map((product) => ({
    url: `${baseUrl}/store/${product.link_slug}`,
    lastModified: new Date(product.created_at),
  })) || [];

  return [...staticPages, ...blogUrls, ...productUrls];
}
