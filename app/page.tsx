"use client"

import { AppLoading } from "@/components/app-loading"
import { useState,useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { BudgetProvider, useBudget } from "@/lib/budget-context"
import { AppSidebar, MobileNav } from "@/components/app-sidebar"
import { Dashboard } from "@/components/dashboard"
import { FinancePanel } from "@/components/finance-panel"
import { Onboarding } from "@/components/onboarding"
import { LoginPage } from "@/components/login-page"

function AppContent() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { isSetup,budgetChecked } = useBudget()

  const [session, setSession] = useState<any>(null)
  const [isGuest, setIsGuest] = useState<boolean>(false)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      const guest = localStorage.getItem("guest_mode") === "enabled"
      setIsGuest(guest)

      const { data } = await supabase.auth.getSession()
      setSession(data.session)

      setAuthChecked(true)
    }

    initAuth()
  }, [])

  if (!authChecked || !budgetChecked) {
    return <AppLoading />
  }

  if (!session && !isGuest) {
    return <LoginPage />
  }

  if (!isSetup) {
    return <Onboarding />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          <Dashboard activeTab={activeTab} />
          <FinancePanel />
        </div>
      </main>
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}


export default function Home() {
  return (
    <BudgetProvider>
      <AppContent />
    </BudgetProvider>
  )
}
