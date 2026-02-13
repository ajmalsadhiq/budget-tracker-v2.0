"use client"

import React from "react"

import { useState } from "react"
import { useBudget } from "@/lib/budget-context"
import { IndianRupee, Wallet, ArrowRight } from "lucide-react"

export function Onboarding() {
  const { completeSetup } = useBudget()
  const [income, setIncome] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const val = Number.parseFloat(income)
    if (Number.isNaN(val) || val <= 0) {
      setError("Please enter a valid income amount")
      return
    }
    completeSetup(val)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/15 mb-4">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground text-balance text-center">
            Budget Tracker
          </h1>
          <p className="text-sm text-muted-foreground mt-2 text-center text-pretty">
            Take control of your finances. Start by entering your monthly income or pocket money.
          </p>
          <span className="text-[10px] text-muted-foreground mt-1 font-mono">v2.0</span>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl bg-card border border-border p-6">
          <label htmlFor="setup-income" className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            Monthly Income / Pocket Money
          </label>
          <div className="relative mb-4">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <IndianRupee className="w-4 h-4 text-muted-foreground" />
            </div>
            <input
              id="setup-income"
              type="number"
              placeholder="e.g. 50000"
              value={income}
              onChange={(e) => {
                setIncome(e.target.value)
                setError("")
              }}
              className="w-full bg-secondary border border-border rounded-lg pl-9 pr-4 py-3 text-lg font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/50"
              autoFocus
            />
          </div>
          {error && <p className="text-xs text-destructive mb-3">{error}</p>}

          <div className="flex flex-col gap-2 mb-4">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Quick Select</span>
            <div className="flex flex-wrap gap-2">
              {[5000, 10000, 25000, 50000, 75000, 100000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setIncome(amt.toString())
                    setError("")
                  }}
                  className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs text-foreground hover:bg-primary/15 hover:border-primary/30 transition-colors"
                >
                  {new Intl.NumberFormat("en-IN").format(amt)}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-[10px] text-muted-foreground mt-4">
          You can change this anytime from the Finance panel
        </p>
      </div>
    </div>
  )
}
