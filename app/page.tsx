"use client"

import ExpenseTracker from "../expense-tracker"
import { PWARegister } from "./pwa"
import { SplashScreen } from "./splash-screen"

export default function Page() {
  return (
    <>
      <SplashScreen />
      <PWARegister />
      <ExpenseTracker />
    </>
  )
}
