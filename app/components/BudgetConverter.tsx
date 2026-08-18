"use client"
import { useMemo, useState } from "react"

type Props = { value: string }

export default function BudgetConverter({ value }: Props) {
  const [rateUSDToEUR, setRateUSDToEUR] = useState(0.92)
  const [rateUSDToGBP, setRateUSDToGBP] = useState(0.78)

  const parsed = useMemo(() => {
    if (!value) return null
    // extract first number from string, allow ranges like 200-500
    const m = value.match(/\d+[\d,\.]*/)
    if (!m) return null
    const num = Number(m[0].replace(/,/g, ''))
    if (Number.isNaN(num)) return null
    return num
  }, [value])

  if (!parsed) return <div className="mt-2 text-sm text-gray-500">Enter a numeric budget to see conversions.</div>

  const eur = (parsed * rateUSDToEUR).toFixed(2)
  const gbp = (parsed * rateUSDToGBP).toFixed(2)

  return (
    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="text-xs text-gray-600">Parsed USD amount</div>
          <div className="font-medium">${parsed.toLocaleString()}</div>
        </div>
        <div className="w-1/3">
          <div className="text-xs text-gray-600">EUR (approx)</div>
          <div className="font-medium">€{eur}</div>
        </div>
        <div className="w-1/3">
          <div className="text-xs text-gray-600">GBP (approx)</div>
          <div className="font-medium">£{gbp}</div>
        </div>
      </div>

      <details className="mt-2 text-xs text-gray-600">
        <summary className="cursor-pointer">Adjust conversion rates</summary>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <label className="text-xs">USD → EUR
            <input type="number" step="0.01" value={rateUSDToEUR} onChange={(e) => setRateUSDToEUR(Number(e.target.value))} className="mt-1 w-full p-1 border rounded" />
          </label>
          <label className="text-xs">USD → GBP
            <input type="number" step="0.01" value={rateUSDToGBP} onChange={(e) => setRateUSDToGBP(Number(e.target.value))} className="mt-1 w-full p-1 border rounded" />
          </label>
        </div>
      </details>
    </div>
  )
}
