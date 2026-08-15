"use client"
import React from "react"

type Props = {
  trackingId: number | string | null
  title?: string
  subtitle?: string
}

export default function SuccessConfirmation({ trackingId, title, subtitle }: Props) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6 text-center">
        <h2 className="text-2xl font-semibold">{title ?? "Success"}</h2>
        {subtitle && <p className="mt-3 text-sm text-gray-600">{subtitle}</p>}
        {trackingId && (
          <p className="mt-4 text-sm text-gray-700">Your tracking ID: <span className="font-mono">{trackingId}</span></p>
        )}
      </div>
    </main>
  )
}
