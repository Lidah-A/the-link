import { NextResponse } from "next/server"
import supabase from "@/lib/supabaseServer"
import { z } from "zod"

const BodySchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1),
  name: z.string().optional(),
  email: z.string().optional(),
})

const OPENAI_KEY = process.env.OPENAI_API_KEY
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'
const SYSTEM_PROMPT = process.env.CHATBOT_SYSTEM_PROMPT || 'You are a helpful assistant.'

export async function POST(req: Request) {
  try {
    if (!OPENAI_KEY) return NextResponse.json({ success: false, error: 'OpenAI API key not set' }, { status: 500 })

    const body = await req.json()
    const parsed = BodySchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ success: false, error: 'Invalid payload', details: parsed.error.flatten().fieldErrors }, { status: 400 })

    const { conversationId, message, name, email } = parsed.data

    // Call OpenAI chat completion
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({ model: OPENAI_MODEL, messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: message }] }),
    })

    if (!resp.ok) {
      const errText = await resp.text()
      return NextResponse.json({ success: false, error: 'LLM error', details: errText }, { status: 502 })
    }

    const j = await resp.json()
    const assistant = j.choices?.[0]?.message?.content ?? ''

    // Persist conversation and message to Supabase (best-effort)
    try {
      let convId = conversationId
      if (!convId) {
        const { data: convData, error: convErr } = await supabase.from('conversations').insert([{ name: name ?? null, email: email ?? null }]).select('id').limit(1).single()
        if (convErr) throw convErr
        convId = convData.id
      }

      // insert user message and assistant reply
      await supabase.from('messages').insert([
        { conversation_id: convId, role: 'user', content: message },
        { conversation_id: convId, role: 'assistant', content: assistant },
      ])
    } catch (e) {
      console.warn('Failed to persist conversation', e)
    }

    return NextResponse.json({ success: true, reply: assistant })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
