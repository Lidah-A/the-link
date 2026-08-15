import { NextResponse } from "next/server"
import supabase from "../../../lib/supabaseServer"

export async function POST(req: Request) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth?.startsWith('Bearer ')) return NextResponse.json({ success: false, error: 'Missing authorization' }, { status: 401 })
    const token = auth.split(' ')[1]

    const { data: userData, error: userErr } = await supabase.auth.getUser(token)
    if (userErr || !userData?.user) return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 })

    const body = await req.json()
    const { requestId, path, action } = body
    if (!requestId || !path || !action) return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 })

    // insert audit record
    const record = {
      request_id: requestId,
      path,
      action,
      actor_email: userData.user.email,
      created_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('attachment_audit').insert([record])
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
