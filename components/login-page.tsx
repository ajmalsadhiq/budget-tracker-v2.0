"use client"

import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"
import { ArrowRight, Wallet } from "lucide-react"
import { FcGoogle } from "react-icons/fc"

export function LoginPage() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/`,
      },
    })
  }

  const continueAsGuest = () => {
    localStorage.setItem("guest_mode", "enabled")
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[2.5fr_2.5fr] bg-background">
      
      {/* LEFT SIDE – AUTH */}
      <div className="flex flex-col justify-center items-center p-8">
        <div className="max-w-sm w-full">
          
          {/* LOGO + TITLE */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/15 mb-5">
              <Wallet className="w-10 h-10 text-primary" />
            </div>

            <h1 className="text-3xl font-bold text-foreground text-center">
              AJ-Budget Tracker
            </h1>

            <p className="text-sm text-muted-foreground mt-2 text-center">
              Smart way to manage your money
            </p>

            <span className="text-[10px] text-muted-foreground mt-1 font-mono">
              v2.0
            </span>
          </div>

          {/* BUTTONS */}
          <div className="rounded-xl bg-card border border-border p-6 space-y-4">
            
            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-lg bg-primary text-primary-foreground text-base font-semibold hover:bg-primary/90 transition-colors"
            >
              <FcGoogle className="w-5 h-5 bg-white rounded-full p-[2px]" />
              Sign in with Google
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={continueAsGuest}
              className="w-full px-4 py-4 rounded-lg border border-border text-base font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              Continue as Guest
            </button>
          </div>

          <p className="text-center text-[10px] text-muted-foreground mt-4">
            Guest data stays only on this device
          </p>
        </div>
      </div>

      {/* RIGHT SIDE – INFO */}
      <div className="hidden md:flex flex-col justify-center p-12 bg-secondary/40">
        
        <h2 className="text-3xl font-bold mb-4">
          Take control of your finances 💵
        </h2>

        <p className="text-muted-foreground mb-6 max-w-md">
          Welcome to Ajmal's first full stack app — a Budget Tracker web app that
          helps you understand where your money goes, save better, and build
          healthy financial habits.
        </p>

        <ul className="space-y-3 text-sm mb-8">
          <li>✔ Set your monthly income</li>
          <li>✔ Track expenses by category</li>
          <li>✔ Visualize spending with charts</li>
          <li>✔ Secure Google login</li>
        </ul>

        {/* IMAGE PREVIEW */}
        <div className="max-w-2xl">
          <div className="relative w-full h-72 rounded-xl overflow-hidden border border-border shadow-lg
                transition-transform duration-300 ease-out
                hover:scale-[1.03] hover:shadow-xl group">
            <Image
              src="/tab.png"
              alt="Dashboard preview"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />

          </div>
        </div>
      </div>
    </div>
  )
}
