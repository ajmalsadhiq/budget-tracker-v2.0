"use client"

import { useBudget, formatINR } from "@/lib/budget-context"
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react"

export function StatsCards() {
  const { income, totalExpenses, savings, expenses } = useBudget()
  const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : "0"
  const daysInMonth = new Date().getDate() || 1

  const uniqueDays = new Set(expenses.map((e) => e.date)).size
  const dailyAvg = uniqueDays > 0 ? Math.round(totalExpenses / uniqueDays) : 0

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="flex flex-col gap-2 rounded-xl bg-card border border-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/15">
            <Wallet className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xs text-muted-foreground">Income</span>
        </div>
        <p className="text-xl font-semibold text-foreground">{formatINR(income)}</p>
        <p className="text-xs text-primary">Monthly</p>
      </div>

      <div className="flex flex-col gap-2 rounded-xl bg-card border border-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/15">
            <TrendingDown className="w-4 h-4 text-accent" />
          </div>
          <span className="text-xs text-muted-foreground">Expenses</span>
        </div>
        <p className="text-xl font-semibold text-foreground">{formatINR(totalExpenses)}</p>
        <p className="text-xs text-accent">{expenses.length} transactions</p>
      </div>

      <div className="flex flex-col gap-2 rounded-xl bg-card border border-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/15">
            <PiggyBank className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xs text-muted-foreground">Savings</span>
        </div>
        <p className={`text-xl font-semibold ${savings >= 0 ? "text-primary" : "text-destructive"}`}>
          {formatINR(savings)}
        </p>
        <p className="text-xs text-muted-foreground">{savingsRate}% of income</p>
      </div>

      <div className="flex flex-col gap-2 rounded-xl bg-card border border-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/15">
            <TrendingUp className="w-4 h-4 text-accent" />
          </div>
          <span className="text-xs text-muted-foreground">Daily Avg</span>
        </div>
        <p className="text-xl font-semibold text-foreground">{formatINR(dailyAvg)}</p>
        <p className="text-xs text-muted-foreground">Per day spending</p>
      </div>
    </div>
  )
}
