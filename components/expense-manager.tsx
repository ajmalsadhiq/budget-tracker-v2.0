"use client"

import React from "react"
import { useState } from "react"
import { useBudget, CATEGORIES, formatINR } from "@/lib/budget-context"
import type { Expense } from "@/lib/budget-context"
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  ShoppingBag,
  Utensils,
  Car,
  Zap,
  Tv,
  Shield,
  Heart,
  GraduationCap,
  MoreHorizontal,
  Home,
} from "lucide-react"

const categoryIcons: Record<string, React.ElementType> = {
  Food: Utensils,
  Transport: Car,
  Utilities: Zap,
  Entertainment: Tv,
  Insurance: Shield,
  Shopping: ShoppingBag,
  Healthcare: Heart,
  Education: GraduationCap,
  Rent: Home,
  Other: MoreHorizontal,
}

interface ExpenseFormData {
  category: string
  amount: string
  date: string
  note: string
}

const emptyForm: ExpenseFormData = {
  category: "Food",
  amount: "",
  date: new Date().toISOString().split("T")[0],
  note: "",
}

export function ExpenseManager() {
  const { expenses, addExpense, editExpense, deleteExpense } = useBudget()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ExpenseFormData>(emptyForm)

  const handleSubmit = () => {
    const amount = Number.parseFloat(form.amount)
    if (Number.isNaN(amount) || amount <= 0 || !form.category || !form.date) return

    if (editingId) {
      editExpense(editingId, {
        category: form.category,
        amount,
        date: form.date,
        note: form.note,
      })
      setEditingId(null)
    } else {
      addExpense({
        category: form.category,
        amount,
        date: form.date,
        note: form.note,
      })
    }
    setForm(emptyForm)
    setShowForm(false)
  }

  const handleEdit = (expense: Expense) => {
    setForm({
      category: expense.category,
      amount: expense.amount.toString(),
      date: expense.date,
      note: expense.note,
    })
    setEditingId(expense.id)
    setShowForm(true)
  }

  const handleCancel = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  const sortedExpenses = [...expenses].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Expense Manager</h3>
        <button
          onClick={() => {
            setForm(emptyForm)
            setEditingId(null)
            setShowForm(!showForm)
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-4 p-4 rounded-xl bg-secondary border border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-foreground">
              {editingId ? "Edit Expense" : "New Expense"}
            </span>
            <button onClick={handleCancel} className="p-1 rounded hover:bg-card transition-colors">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="expense-category" className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Category
              </label>
              <select
                id="expense-category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="expense-amount" className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Amount (INR)
              </label>
              <input
                id="expense-amount"
                type="number"
                placeholder="0"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="expense-date" className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Date
              </label>
              <input
                id="expense-date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="expense-note" className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Note
              </label>
              <input
                id="expense-note"
                type="text"
                placeholder="Description"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            {editingId ? "Update" : "Add Expense"}
          </button>
        </div>
      )}

      {/* Expense List */}
      {sortedExpenses.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary mb-3">
            <ShoppingBag className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground mb-1">No expenses yet</p>
          <p className="text-[10px] text-muted-foreground">Click "Add" to start tracking your spending</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1 max-h-80 overflow-y-auto pr-1">
          {sortedExpenses.map((expense) => {
            const Icon = categoryIcons[expense.category] || MoreHorizontal
            return (
              <div
                key={expense.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors group"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground">{expense.category}</span>
                    <span className="text-[10px] text-muted-foreground truncate">{expense.note}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(expense.date).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <span className="text-xs font-semibold text-accent tabular-nums">
                  {formatINR(expense.amount)}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="p-1 rounded hover:bg-card transition-colors"
                    aria-label="Edit expense"
                  >
                    <Pencil className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                  </button>
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="p-1 rounded hover:bg-card transition-colors"
                    aria-label="Delete expense"
                  >
                    <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
