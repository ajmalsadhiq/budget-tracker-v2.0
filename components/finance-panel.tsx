"use client"

import { supabase } from "@/lib/supabaseClient"
import { useState } from "react"
import { useBudget, formatINR } from "@/lib/budget-context"
import { Pencil, Check, X, IndianRupee, Target, TrendingUp } from "lucide-react"

export function FinancePanel() {
  const { income, setIncome, totalExpenses, savings, categoryTotals } = useBudget()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(income.toString())

  const handleSave = () => {
    const val = Number.parseFloat(editValue)
    if (!Number.isNaN(val) && val >= 0) {
      setIncome(val)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(income.toString())
    setIsEditing(false)
  }
  const handleLogout = async () => {
  // Sign out Google user (if logged in)
    await supabase.auth.signOut()

  // Clear guest data
    localStorage.removeItem("guest_mode")
    localStorage.removeItem("guest_isSetup")
    localStorage.removeItem("guest_income")

  // Reload app → Login page
    window.location.href = "/"
  }


  const savingsPercent = income > 0 ? (savings / income) * 100 : 0
  const expensePercent = income > 0 ? (totalExpenses / income) * 100 : 0

  const biggestCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]

  return (
    <aside className="hidden xl:flex flex-col w-72 border-l border-border bg-card p-5 gap-5 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Finance</h2>
        <IndianRupee className="w-4 h-4 text-primary" />
      </div>

      {/* Income Editor */}
      <div className="rounded-xl bg-secondary p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Monthly Income</span>
          {!isEditing ? (
            <button
              onClick={() => {
                setEditValue(income.toString())
                setIsEditing(true)
              }}
              className="p-1 rounded hover:bg-card transition-colors"
              aria-label="Edit income"
            >
              <Pencil className="w-3 h-3 text-muted-foreground" />
            </button>
          ) : (
            <div className="flex gap-1">
              <button
                onClick={handleSave}
                className="p-1 rounded hover:bg-card transition-colors"
                aria-label="Save"
              >
                <Check className="w-3 h-3 text-primary" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 rounded hover:bg-card transition-colors"
                aria-label="Cancel"
              >
                <X className="w-3 h-3 text-destructive" />
              </button>
            </div>
          )}
        </div>
        {isEditing ? (
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave()
              if (e.key === "Escape") handleCancel()
            }}
            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-lg font-bold text-foreground outline-none focus:ring-1 focus:ring-primary"
            autoFocus
          />
        ) : (
          <p className="text-2xl font-bold text-foreground">{formatINR(income)}</p>
        )}
      </div>

      {/* Budget Progress */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground">Budget Used</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all bg-accent"
            style={{ width: `${Math.min(expensePercent, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{expensePercent.toFixed(1)}% spent</span>
          <span className="text-foreground">{formatINR(totalExpenses)}</span>
        </div>
      </div>

      {/* Savings Progress */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground">Savings</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all bg-primary"
            style={{ width: `${Math.max(savingsPercent, 0)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{savingsPercent.toFixed(1)}% saved</span>
          <span className={savings >= 0 ? "text-primary" : "text-destructive"}>
            {formatINR(savings)}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex flex-col gap-2 mt-auto">
        <h3 className="text-xs font-medium text-muted-foreground mb-1">Quick Stats</h3>
        <div className="flex items-center justify-between py-2 border-t border-border">
          <span className="text-xs text-muted-foreground">Top category</span>
          <span className="text-xs text-foreground font-medium">
            {biggestCategory ? biggestCategory[0] : "---"}
          </span>
        </div>
        <div className="flex items-center justify-between py-2 border-t border-border">
          <span className="text-xs text-muted-foreground">Avg per day</span>
          <span className="text-xs text-foreground font-medium">
            {formatINR(Math.round(totalExpenses / Math.max(new Date().getDate(), 1)))}
          </span>
        </div>
        <div className="flex items-center justify-between py-2 border-t border-border">
          <span className="text-xs text-muted-foreground">Version</span>
          <span className="text-xs text-primary font-mono font-medium">v2.0</span>
        </div>
      </div>
      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="mt-4 w-full rounded-lg border border-border px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10 transition"
      >
        Logout
      </button>
    </aside>
  )
}
