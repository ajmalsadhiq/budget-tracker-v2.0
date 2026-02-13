"use client"

import { useBudget, formatINR } from "@/lib/budget-context"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

export function SummaryCards() {
  const { income, totalExpenses, savings, expenses } = useBudget()
  const recentExpenses = [...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)

  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Financial Summary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl bg-primary p-4 text-primary-foreground">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight className="w-4 h-4" />
            <span className="text-xs font-medium opacity-80">Income</span>
          </div>
          <p className="text-lg font-bold mb-3">{formatINR(income)}</p>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-70">Salary/Pocket Money</span>
              <span className="text-xs font-medium">{formatINR(income)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-70">Savings rate</span>
              <span className="text-xs font-medium">
                {income > 0 ? ((savings / income) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-accent p-4 text-accent-foreground">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownRight className="w-4 h-4" />
            <span className="text-xs font-medium opacity-80">Expenses</span>
          </div>
          <p className="text-lg font-bold mb-3">{formatINR(totalExpenses)}</p>
          <div className="flex flex-col gap-1.5">
            {recentExpenses.length === 0 ? (
              <span className="text-xs opacity-70">No expenses yet</span>
            ) : (
              recentExpenses.map((exp) => (
                <div key={exp.id} className="flex items-center justify-between">
                  <span className="text-xs opacity-70">{exp.category}</span>
                  <span className="text-xs font-medium">{formatINR(exp.amount)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
