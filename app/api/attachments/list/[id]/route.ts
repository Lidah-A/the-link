import { NextResponse } from "next/server"
import supabase from "@/lib/supabaseServer"

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'request-attachments'

export async function GET(req: Request, context: any) {
  try {
    const { id } = (context.params && context.params.id) ? { id: context.params.id } : { id: context.params?.id }
    // list files under prefix `${id}/`
    const { data, error } = await supabase.storage.from(BUCKET).list(`${id}/`, { limit: 100, offset: 0 })
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })

    // create signed URLs for each file (1 hour)
    const files = await Promise.all((data || []).map(async (f: { name: string }) => {
      const path = `${id}/${f.name}`
      const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600)
      return { name: f.name, path, url: signed?.signedUrl ?? null }
    }))

    return NextResponse.json({ success: true, files })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
