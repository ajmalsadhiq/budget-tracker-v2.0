"use client"

import { useState } from "react"
import { useBudget, formatINR } from "@/lib/budget-context"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts"
import { cn } from "@/lib/utils"

type Period = "monthly" | "yearly"

export function MonthlyChart() {
  const { monthlyData, yearlyData } = useBudget()
  const [period, setPeriod] = useState<Period>("monthly")

  const chartData = period === "monthly" ? monthlyData : yearlyData
  const xKey = period === "monthly" ? "month" : "year"

  const empty = chartData.length === 0

  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">
          {period === "monthly" ? "Monthly" : "Yearly"} Overview
        </h3>
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
          {(["monthly", "yearly"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors capitalize",
                period === p
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="h-56">
        {empty ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
            Add expenses to see {period} overview
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" />
              <XAxis
                dataKey={xKey}
                tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => {
                  if (v >= 100000) return `${"\u20B9"}${(v / 100000).toFixed(1)}L`
                  if (v >= 1000) return `${"\u20B9"}${(v / 1000).toFixed(1)}k`
                  return `${"\u20B9"}${v}`
                }}
              />
              <Tooltip
                cursor={false}
                contentStyle={{
                  backgroundColor: "hsl(220 22% 10%)",
                  border: "1px solid hsl(220 15% 18%)",
                  borderRadius: "8px",
                  color: "hsl(210 20% 90%)",
                  fontSize: "12px",
                }}
                formatter={(value: number, name: string) => [
                  formatINR(value),
                  name.charAt(0).toUpperCase() + name.slice(1),
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: "11px", color: "hsl(215 15% 55%)" }}
                iconType="circle"
                iconSize={8}
              />
              <Bar dataKey="income" fill="#2dd4a0" radius={[4, 4, 0, 0]} barSize={14} />
              <Bar dataKey="expenses" fill="#e8a838" radius={[4, 4, 0, 0]} barSize={14} />
              <Bar dataKey="savings" fill="#1a9a7a" radius={[4, 4, 0, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
