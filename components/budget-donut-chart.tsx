"use client"

import { useBudget, formatINR } from "@/lib/budget-context"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const COLORS = [
  "#2dd4a0",
  "#e8a838",
  "#1a9a7a",
  "#d4782e",
  "#3be8b8",
  "#c0901e",
  "#15b892",
  "#f0b848",
  "#4af0c0",
  "#a87028",
]

export function BudgetDonutChart() {
  const { categoryTotals, totalExpenses } = useBudget()

  const data = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Budget Tracker</h3>
        <div className="flex items-center justify-center h-48 text-muted-foreground text-xs">
          Add expenses to see your budget breakdown
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Budget Tracker</h3>
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="relative w-48 h-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(220 22% 10%)",
                  border: "1px solid hsl(220 15% 18%)",
                  borderRadius: "8px",
                  color: "hsl(210 20% 90%)",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [formatINR(value), "Amount"]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-lg font-bold text-foreground">{formatINR(totalExpenses)}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-16 lg:w-24 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(item.value / totalExpenses) * 100}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-foreground tabular-nums w-16 text-right">
                  {formatINR(item.value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
