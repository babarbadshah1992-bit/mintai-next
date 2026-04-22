import React from "react";

type Blog = {
  title: string;
  description: string;
  slug: string;
};

async function getBlogs(): Promise<Blog[]> {
  const res = await fetch("http://localhost:3000/api/blogs", {
    cache: "no-store",
  });

  return res.json();
}

export default async function BlogDetail({ params }: any) {
  const blogs = await getBlogs();

  const blog = blogs.find((b) => b.slug === params.slug);

  if (!blog) return <p>Blog not found</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{blog.title}</h1>
      <p>{blog.description}</p>
    </div>
  );
}