import { NextResponse } from "next/server"
import supabase from "../../../lib/supabaseServer"

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'request-attachments'

export async function POST(req: Request) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth?.startsWith('Bearer ')) return NextResponse.json({ success: false, error: 'Missing authorization' }, { status: 401 })
    const token = auth.split(' ')[1]

    const { data: userData, error: userError } = await supabase.auth.getUser(token)
    if (userError || !userData?.user) return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 })

    const body = await req.json()
    const { path, requestId } = body
    if (!path || !requestId) return NextResponse.json({ success: false, error: 'Missing path or requestId' }, { status: 400 })

    // verify ownership: request must belong to user
    const { data: rows, error: qErr } = await supabase.from('sourcing_requests').select('email').eq('id', requestId)
    if (qErr) return NextResponse.json({ success: false, error: qErr.message }, { status: 500 })
    const ownerEmail = rows?.[0]?.email
    if (!ownerEmail || ownerEmail !== userData.user.email) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })

    const { error } = await supabase.storage.from(BUCKET).remove([path])
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })

    // log delete by owner
    try {
      await supabase.from('attachment_audit').insert([{ request_id: requestId, path, action: 'delete', actor_email: userData.user.email, created_at: new Date().toISOString() }])
    } catch (e) {
      console.warn('Failed to write audit', e)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
