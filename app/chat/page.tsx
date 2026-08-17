"use client"
import ChatWidget from "@/app/components/ChatWidget"

export default function ChatPage() {
  return (
    <main className="min-h-screen p-6 bg-[var(--bg)]">
      <div className="max-w-3xl mx-auto">
        <h1 className="brand-heading">Chat with The Link assistant</h1>
        <p className="brand-subtle mt-2">Ask sourcing questions or request help.</p>
        <div className="mt-6">
          <ChatWidget />
        </div>
      </div>
    </main>
  )
}
