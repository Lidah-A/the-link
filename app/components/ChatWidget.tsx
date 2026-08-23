"use client"
import { useState } from "react"

type Msg = { role: 'user' | 'assistant', text: string }

type Props = {
  assistantName?: string
}

export default function ChatWidget({ assistantName = 'Your Personal Assistant' }: Props) {
  const [messages, setMessages] = useState<Msg[]>([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)

  async function send() {
    if (!text.trim()) return
    const userMsg = { role: 'user' as const, text: text.trim() }
    setMessages((m) => [...m, userMsg])
    setText("")
    setLoading(true)
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: userMsg.text }) })
      const j = await res.json()
      if (res.ok && j.reply) {
        setMessages((m) => [...m, { role: 'assistant', text: j.reply }])
      } else {
        setMessages((m) => [...m, { role: 'assistant', text: j.error || `Sorry, ${assistantName} could not get a reply.` }])
      }
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', text: `Error contacting ${assistantName}.` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border rounded p-4 bg-white">
      <div className="h-64 overflow-y-auto mb-3">
        {messages.length === 0 && <div className="text-sm text-gray-500">No messages yet — say hello.</div>}
        {messages.map((m, idx) => (
          <div key={idx} className={m.role === 'user' ? 'text-right mt-2' : 'text-left mt-2'}>
            <div className={m.role === 'user' ? 'inline-block bg-blue-600 text-white px-3 py-1 rounded' : 'inline-block bg-gray-100 text-gray-900 px-3 py-1 rounded'}>{m.text}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 p-2 border rounded" placeholder={`Ask ${assistantName} a question...`} />
        <button onClick={send} disabled={loading} className="brand-btn-primary">{loading ? 'Sending...' : 'Send'}</button>
      </div>
    </div>
  )
}
