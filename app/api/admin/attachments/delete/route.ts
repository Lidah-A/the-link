import { NextResponse } from "next/server"
import supabase from "@/lib/supabaseServer"

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'request-attachments'
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || process.env.TEAM_NOTIFICATION_EMAIL || "").split(",").map(s => s.trim()).filter(Boolean)

export async function POST(req: Request) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth?.startsWith('Bearer ')) return NextResponse.json({ success: false, error: 'Missing authorization' }, { status: 401 })
    const token = auth.split(' ')[1]

    const { data: userData, error: userError } = await supabase.auth.getUser(token)
    if (userError || !userData?.user) return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 })

    const email = userData.user.email
    if (!email || !ADMIN_EMAILS.includes(email)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })

    const body = await req.json()
    const { path } = body
    if (!path) return NextResponse.json({ success: false, error: 'Missing path' }, { status: 400 })

    const { error } = await supabase.storage.from(BUCKET).remove([path])
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })

    // log admin delete
    try {
      await supabase.from('attachment_audit').insert([{ request_id: null, path, action: 'delete', actor_email: email, created_at: new Date().toISOString() }])
    } catch (e) {
      console.warn('Failed to write audit', e)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
