"use client"
import ChatWidget from "@/app/components/ChatWidget"
import PageSeo from "@/app/components/PageSeo"

const CHATBOT_NAME = process.env.NEXT_PUBLIC_CHATBOT_NAME || 'Your Personal Assistant'

export default function ChatPage() {
  return (
    <main className="min-h-screen p-6 bg-[var(--bg)]">
      <PageSeo
        title={`Chat with ${CHATBOT_NAME}`}
        description="Ask sourcing questions, get help with your requests, or talk to the assistant for quick guidance."
      />
      <div className="max-w-3xl mx-auto">
        <h1 className="brand-heading">Chat with {CHATBOT_NAME}</h1>
        <p className="brand-subtle mt-2">Ask sourcing questions or request help.</p>
        <div className="mt-6">
          <ChatWidget assistantName={CHATBOT_NAME} />
        </div>
      </div>
    </main>
  )
}
