"use client"

import ExpenseTracker from "../expense-tracker"
import { PWARegister } from "./pwa"

export default function Page() {
  return (
    <>
      <PWARegister />
      <ExpenseTracker />
    </>
  )
}
