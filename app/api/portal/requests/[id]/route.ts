import { NextResponse } from "next/server"
import supabase from "@/lib/supabaseServer"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = req.headers.get("authorization")
    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Missing authorization" }, { status: 401 })
    }
    const token = auth.split(" ")[1]

    const { data: userData, error: userError } = await supabase.auth.getUser(token)
    if (userError || !userData?.user) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
    }

    const email = userData.user.email
    if (!email) return NextResponse.json({ success: false, error: "No email on user" }, { status: 400 })

    const id = params.id
    const { data, error } = await supabase.from("sourcing_requests").select("*").eq("id", id).eq("email", email)
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    if (!data || data.length === 0) return NextResponse.json({ success: false, error: "Not found or unauthorized" }, { status: 404 })

    return NextResponse.json({ success: true, request: data[0] })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
