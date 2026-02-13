"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  PieChart,
  Settings,
  CircleDollarSign,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Wallet, label: "Expenses", id: "expenses" },
  { icon: TrendingUp, label: "Trends", id: "trends" },
  { icon: PieChart, label: "Reports", id: "reports" },
  { icon: Settings, label: "Settings", id: "settings" },
]

interface AppSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  return (
    <aside className="hidden md:flex flex-col items-center w-[72px] py-6 gap-2 border-r border-border bg-card">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary mb-6">
        <CircleDollarSign className="w-5 h-5 text-primary-foreground" />
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
              activeTab === item.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
            aria-label={item.label}
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </nav>
    </aside>
  )
}

export function MobileNav({
  activeTab,
  onTabChange,
}: AppSidebarProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-card border-t border-border py-2 px-4">
      {navItems.slice(0, 4).map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={cn(
            "flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors",
            activeTab === item.id
              ? "text-primary"
              : "text-muted-foreground"
          )}
          aria-label={item.label}
        >
          <item.icon className="w-5 h-5" />
          <span className="text-[10px]">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
