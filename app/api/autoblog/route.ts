import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
 process.env.NEXT_PUBLIC_SUPABASE_URL!,
 process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {

 const title = "Haldi Benefits"

 const slug = "haldi-benefits"

 const content = `
Haldi ek powerful ayurvedic herb hai.

Isme curcumin hota hai jo:

- immunity strong karta hai
- inflammation kam karta hai
- skin glow improve karta hai
- digestion improve karta hai

Roz haldi doodh lene se health better hoti hai.
`

 await supabase.from("blogs").insert({
  title,
  slug,
  content
 })

 return Response.json({
  success:true
 })

}