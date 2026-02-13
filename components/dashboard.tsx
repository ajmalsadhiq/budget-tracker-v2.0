"use client"

import { useBudget } from "@/lib/budget-context"
import { StatsCards } from "@/components/stats-cards"
import { BudgetDonutChart } from "@/components/budget-donut-chart"
import { DailySpendingChart } from "@/components/daily-spending-chart"
import { MonthlyChart } from "@/components/monthly-chart"
import { SummaryCards } from "@/components/summary-cards"
import { ExpenseManager } from "@/components/expense-manager"

interface DashboardProps {
  activeTab: string
}

export function Dashboard({ activeTab }: DashboardProps) {
  const { userName } = useBudget() // Moved hook call to the top level

  if (activeTab === "expenses") {
    return (
      <div className="flex flex-col gap-4 p-4 lg:p-6 flex-1 overflow-y-auto pb-20 md:pb-6">
        <header>
          <h1 className="text-xl font-bold text-foreground">Expense Manager</h1>
          <p className="text-xs text-muted-foreground mt-1">Add, edit, and manage your expenses</p>
        </header>
        <ExpenseManager />
      </div>
    )
  }

  if (activeTab === "trends") {
    return (
      <div className="flex flex-col gap-4 p-4 lg:p-6 flex-1 overflow-y-auto pb-20 md:pb-6">
        <header>
          <h1 className="text-xl font-bold text-foreground">Spending Trends</h1>
          <p className="text-xs text-muted-foreground mt-1">Analyze your spending patterns over time</p>
        </header>
        <DailySpendingChart />
        <MonthlyChart />
      </div>
    )
  }

  if (activeTab === "reports") {
    return (
      <div className="flex flex-col gap-4 p-4 lg:p-6 flex-1 overflow-y-auto pb-20 md:pb-6">
        <header>
          <h1 className="text-xl font-bold text-foreground">Reports</h1>
          <p className="text-xs text-muted-foreground mt-1">Detailed breakdown of your finances</p>
        </header>
        <BudgetDonutChart />
        <SummaryCards />
      </div>
    )
  }

  if (activeTab === "settings") {
    return (
      <div className="flex flex-col gap-4 p-4 lg:p-6 flex-1 overflow-y-auto pb-20 md:pb-6">
        <header>
          <h1 className="text-xl font-bold text-foreground">Settings</h1>
          <p className="text-xs text-muted-foreground mt-1">Manage your budget preferences</p>
        </header>
        <SettingsView />
      </div>
    )
  }

  // Default: Dashboard
  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6 flex-1 overflow-y-auto pb-20 md:pb-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Welcome{userName ? `, ${userName}` : ""}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Your financial overview</p>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">v2.0</span>
      </header>
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BudgetDonutChart />
        <DailySpendingChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MonthlyChart />
        <ExpenseManager />
      </div>
      <SummaryCards />
    </div>
  )
}

function SettingsView() {
  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Budget Settings</h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Currency</span>
          <span className="text-sm text-foreground">INR ({"\u20B9"})</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Budget Period</span>
          <span className="text-sm text-foreground">Monthly</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Version</span>
          <span className="text-sm text-primary font-mono">Budget Tracker v2.0</span>
        </div>
      </div>
    </div>
  )
}
