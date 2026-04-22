import { NextResponse } from "next/server";

export async function GET() {
  const blogs = [
    {
      id: 1,
      title: "Sardi me kya khaye aur kya karein",
      description: "Sardi se bachne ke liye kya khana chahiye aur kya nahi.",
      slug: "sardi-guide",
    },
    {
      id: 2,
      title: "How to Lower BP Naturally",
      description: "5 natural tarike BP control karne ke liye.",
      slug: "bp-control",
    },
    {
      id: 3,
      title: "Sardi Khansi Ke Gharelu Upay",
      description: "5 effective remedies sardi khansi ke liye.",
      slug: "cough-remedies",
    },
  ];

  return NextResponse.json(blogs);
}