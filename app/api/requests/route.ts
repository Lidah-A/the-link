import { NextResponse } from "next/server"
import supabase from "@/lib/supabaseServer"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // Insert the incoming data into the sourcing_requests table.
    // Expectation: the table accepts the submitted keys or a JSON column to store the payload.
    const payload = { ...body, created_at: new Date().toISOString() }

    const { data, error } = await supabase.from("sourcing_requests").insert([payload]).select()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.[0]?.id ?? null }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
