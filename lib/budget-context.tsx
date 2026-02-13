"use client"


import React, { createContext, useContext, useState, useCallback, useMemo } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useEffect } from "react"

export interface Expense {
  id: string
  category: string
  amount: number
  date: string
  note: string
}

interface BudgetContextType {
  userName: string
  setUserName: (name: string) => void
  income: number
  setIncome: (income: number) => void
  isSetup: boolean
  budgetChecked: boolean
  completeSetup: (income: number) => void
  expenses: Expense[]
  addExpense: (expense: Omit<Expense, "id">) => void
  editExpense: (id: string, expense: Omit<Expense, "id">) => void
  deleteExpense: (id: string) => void
  totalExpenses: number
  savings: number
  categoryTotals: Record<string, number>
  dailySpending: { date: string; amount: number }[]
  monthlyData: { month: string; income: number; expenses: number; savings: number }[]
  yearlyData: { year: string; income: number; expenses: number; savings: number }[]
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined)

const CATEGORIES = [
  "Food",
  "Transport",
  "Utilities",
  "Entertainment",
  "Insurance",
  "Shopping",
  "Healthcare",
  "Education",
  "Rent",
  "Other",
]

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState("")
  const [isSetup, setIsSetup] = useState(() => {
    if (typeof window === "undefined") return false
    return localStorage.getItem("guest_isSetup") === "true"
  })

  const [budgetChecked, setBudgetChecked] = useState(false)


  const [income, setIncome] = useState(() => {
    if (typeof window === "undefined") return 0
    if (localStorage.getItem("guest_mode") !== "enabled") return 0

    const saved = localStorage.getItem("guest_income")
    return saved ? Number(saved) : 0
  })

  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    const loadProfile = async () => {
      const isGuest = localStorage.getItem("guest_mode") === "enabled"

      // Guest mode → no Supabase
      if (isGuest) {
        setBudgetChecked(true)
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Not logged in
      if (!user) {
        setBudgetChecked(true)
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profile) {
        setIncome(profile.income)
        setIsSetup(profile.is_setup)
        setUserName(user.user_metadata?.full_name || "User")
      }

      // 🔑 THIS LINE STOPS THE FLASH
      setBudgetChecked(true)
    }

    loadProfile()
  }, [])


  useEffect(() => {
    const loadExpenses = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

    // Not logged in or guest → skip
      if (!user) return
      if (localStorage.getItem("guest_mode") === "enabled") return

      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true })

      if (!error && data) {
        setExpenses(
          data.map((e) => ({
            id: e.id,
            category: e.category,
            amount: Number(e.amount),
            date: e.date,
            note: e.note ?? "",
          }))
        )
      }
    }

    loadExpenses()
  }, [])



  const completeSetup = useCallback(async (incomeVal: number) => {
    setIncome(incomeVal)
    setIsSetup(true)

    const isGuest = localStorage.getItem("guest_mode") === "enabled"

  // Guest → localStorage
    if (isGuest) {
      localStorage.setItem("guest_income", incomeVal.toString())
      localStorage.setItem("guest_isSetup", "true")
      return
    }

  // Logged-in user → Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    await supabase.from("profiles").upsert({
      id: user.id,
      income: incomeVal,
      is_setup: true,
    })
  }, [])


  const addExpense = useCallback(async (expense: Omit<Expense, "id">) => {
    const isGuest = localStorage.getItem("guest_mode") === "enabled"

    // Guest → local only
    if (isGuest) {
      const id = Date.now().toString() + Math.random().toString(36).slice(2, 6)
      setExpenses((prev) => [...prev, { ...expense, id }])
      return
    }

    // Logged-in user → Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from("expenses")
      .insert({
        user_id: user.id,
        category: expense.category,
        amount: expense.amount,
        date: expense.date,
        note: expense.note,
      })
      .select()
      .single()

    if (!error && data) {
      setExpenses((prev) => [
        ...prev,
        {
          id: data.id,
          category: data.category,
          amount: Number(data.amount),
          date: data.date,
          note: data.note ?? "",
        },
      ])
    }
  }, [])


  const editExpense = useCallback(async (id: string, expense: Omit<Expense, "id">) => {
    const isGuest = localStorage.getItem("guest_mode") === "enabled"

    // Guest → local only
    if (isGuest) {
      setExpenses((prev) => prev.map((e) => (e.id === id ? { ...expense, id } : e)))
      return
    }

    // Logged-in user → Supabase
    const { error } = await supabase
      .from("expenses")
      .update({
        category: expense.category,
        amount: expense.amount,
        date: expense.date,
        note: expense.note,
      })
      .eq("id", id)

    if (!error) {
      setExpenses((prev) => prev.map((e) => (e.id === id ? { ...expense, id } : e)))
    }
  }, [])


  const deleteExpense = useCallback(async (id: string) => {
    const isGuest = localStorage.getItem("guest_mode") === "enabled"

    // Guest → local only
    if (isGuest) {
      setExpenses((prev) => prev.filter((e) => e.id !== id))
      return
    }

    // Logged-in user → Supabase
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id)

    if (!error) {
      setExpenses((prev) => prev.filter((e) => e.id !== id))
    }
  }, [])


  const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses])
  const savings = income - totalExpenses

  const categoryTotals = useMemo(
    () =>
      expenses.reduce(
        (acc, e) => {
          acc[e.category] = (acc[e.category] || 0) + e.amount
          return acc
        },
        {} as Record<string, number>
      ),
    [expenses]
  )

  const dailySpending = useMemo(
    () =>
      Object.values(
        expenses.reduce(
          (acc, e) => {
            if (!acc[e.date]) {
              acc[e.date] = { date: e.date, amount: 0 }
            }
            acc[e.date].amount += e.amount
            return acc
          },
          {} as Record<string, { date: string; amount: number }>
        )
      ).sort((a, b) => a.date.localeCompare(b.date)),
    [expenses]
  )

  const monthlyData = useMemo(() => {
    const grouped: Record<string, number> = {}
    for (const e of expenses) {
      const monthKey = e.date.slice(0, 7)
      grouped[monthKey] = (grouped[monthKey] || 0) + e.amount
    }
    const months = Object.keys(grouped).sort()
    return months.map((m) => {
      const d = new Date(m + "-01")
      return {
        month: d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
        income,
        expenses: grouped[m],
        savings: income - grouped[m],
      }
    })
  }, [expenses, income])

  const yearlyData = useMemo(() => {
    const grouped: Record<string, number> = {}
    for (const e of expenses) {
      const yearKey = e.date.slice(0, 4)
      grouped[yearKey] = (grouped[yearKey] || 0) + e.amount
    }
    const years = Object.keys(grouped).sort()
    return years.map((y) => ({
      year: y,
      income: income * 12,
      expenses: grouped[y],
      savings: income * 12 - grouped[y],
    }))
  }, [expenses, income])

  return (
    <BudgetContext.Provider
      value={{
        userName,
        setUserName,
        income,
        setIncome,
        isSetup,
        budgetChecked,
        completeSetup,
        expenses,
        addExpense,
        editExpense,
        deleteExpense,
        totalExpenses,
        savings,
        categoryTotals,
        dailySpending,
        monthlyData,
        yearlyData,
      }}
    >
      {children}
    </BudgetContext.Provider>
  )
}

export function useBudget() {
  const ctx = useContext(BudgetContext)
  if (!ctx) throw new Error("useBudget must be used within a BudgetProvider")
  return ctx
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export { CATEGORIES }
