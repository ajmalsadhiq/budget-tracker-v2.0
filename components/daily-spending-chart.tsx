"use client"

import { useBudget, formatINR } from "@/lib/budget-context"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

export function DailySpendingChart() {
  const { dailySpending } = useBudget()

  const formatted = dailySpending.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
  }))

  if (formatted.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Daily Spending</h3>
        <div className="flex items-center justify-center h-48 text-muted-foreground text-xs">
          Add expenses to see daily spending trends
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Daily Spending</h3>
        <span className="text-xs text-muted-foreground">{formatted.length} days tracked</span>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formatted} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2dd4a0" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2dd4a0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" />
            <XAxis
              dataKey="label"
              tick={{ fill: "hsl(215 15% 55%)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "hsl(215 15% 55%)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${"\u20B9"}${v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220 22% 10%)",
                border: "1px solid hsl(220 15% 18%)",
                borderRadius: "8px",
                color: "hsl(210 20% 90%)",
                fontSize: "12px",
              }}
              formatter={(value: number) => [formatINR(value), "Spent"]}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#2dd4a0"
              strokeWidth={2}
              fill="url(#spendGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
