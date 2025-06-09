"use client"

import { useState, useEffect } from "react"

export function SplashScreen() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <img
          src="/windows11/LargeTile.scale-100.png"
          alt="Useless Expense Tracker"
          className="w-64 h-64 animate-pulse-gentle"
        />
        <div className="mt-4 text-xl font-bold">Loading...</div>
      </div>
    </div>
  )
}
