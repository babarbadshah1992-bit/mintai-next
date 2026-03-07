import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export default async function Home() {

const { data: blogs } = await supabase
.from("blogs")
.select("*")
.order("created_at", { ascending: false });

return (
<div style={{ maxWidth: "800px", margin: "50px auto" }}>
<h1>MintAI Health Blogs</h1>

{blogs?.map((blog) => (
<div key={blog.id}>
<Link href={`/blog/${blog.slug}`}>
<h2>{blog.title}</h2>
</Link>
</div>
))}

</div>
);
}