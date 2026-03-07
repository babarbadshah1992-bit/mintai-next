import Link from "next/link";
import { createClient } from "../../../lib/supabase";

export default async function Home() {

  const supabase = createClient();

  const { data: blogs } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto" }}>
      <h1>MintAI Health Blogs</h1>

      {blogs?.map((blog) => (
        <div key={blog.id} style={{ marginTop: "20px" }}>
          <Link href={`/blog/${blog.slug}`}>
            <h2 style={{ cursor: "pointer", color: "blue" }}>
              {blog.title}
            </h2>
          </Link>
          <p>{blog.content}</p>
        </div>
      ))}

    </div>
  );
}