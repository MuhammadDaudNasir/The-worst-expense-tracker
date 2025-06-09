"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Download, Plus, DollarSign, Receipt, TrendingUp } from "lucide-react"
import * as XLSX from "xlsx"

interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: string
}

const categories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Travel",
  "Education",
  "Other",
]

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [isExporting, setIsExporting] = useState(false)
  const [newExpenseId, setNewExpenseId] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const addExpense = () => {
    if (!amount || !description || !category) return

    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: Number.parseFloat(amount),
      description,
      category,
      date,
    }

    setExpenses([newExpense, ...expenses])
    setNewExpenseId(newExpense.id)
    setAmount("")
    setDescription("")
    setCategory("")
    setDate(new Date().toISOString().split("T")[0])

    // Remove highlight after animation
    setTimeout(() => setNewExpenseId(null), 1000)
  }

  const deleteExpense = (id: string) => {
    // Add fade out animation
    const element = document.querySelector(`[data-expense-id="${id}"]`)
    if (element) {
      element.classList.add("animate-fade-out")
      setTimeout(() => {
        setExpenses(expenses.filter((expense) => expense.id !== id))
      }, 300)
    } else {
      setExpenses(expenses.filter((expense) => expense.id !== id))
    }
  }

  const exportToExcel = async () => {
    setIsExporting(true)

    // Add a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create worksheet from expenses data
    const worksheet = XLSX.utils.json_to_sheet(
      expenses.map((expense) => ({
        Date: expense.date,
        Description: expense.description,
        Category: expense.category,
        Amount: expense.amount,
      })),
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses")

    // Add totals row
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    XLSX.utils.sheet_add_aoa(worksheet, [["", "", "Total:", totalAmount]], { origin: `A${expenses.length + 2}` })

    // Generate Excel file as array buffer
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })

    // Convert to Blob
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })

    // Create download link and trigger download
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `expenses_${new Date().toISOString().split("T")[0]}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setIsExporting(false)
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0, -8px, 0);
          }
          70% {
            transform: translate3d(0, -4px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-fade-in-down {
          animation: fadeInDown 0.5s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.5s ease-out forwards;
        }
        
        .animate-pulse-gentle {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .animate-fade-out {
          animation: fadeOut 0.3s ease-out forwards;
        }
        
        .animate-bounce {
          animation: bounce 1s ease-in-out;
        }
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .button-press {
          transition: all 0.1s ease;
        }
        
        .button-press:active {
          transform: scale(0.98);
        }
        
        .new-expense {
          background: linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.02) 100%);
          animation: fadeInDown 0.5s ease-out, pulse 0.8s ease-in-out;
        }
        
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        
        .number-counter {
          transition: all 0.3s ease;
        }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-8">
        <div className={`text-center ${isLoaded ? "animate-fade-in-down" : "opacity-0"}`}>
          <h1 className="text-3xl font-bold text-black mb-2 flex items-center justify-center gap-3">
            <Receipt className="w-8 h-8" />
            Useless Expense Tracker
          </h1>
          <p className="text-gray-600">by yours truly, Muhmmnad Daud Nasir</p>
        </div>

        {/* Add Expense Form */}
        <Card className={`border-2 border-black hover-lift ${isLoaded ? "animate-fade-in-up stagger-1" : "opacity-0"}`}>
          <CardHeader className="bg-black text-white">
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Expense
            </CardTitle>
            <CardDescription className="text-gray-300">Enter your expense details below</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-black font-medium">
                  Amount ($)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border-2 border-gray-300 focus:border-black transition-all duration-300 focus:scale-105"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-black font-medium">
                  Description
                </Label>
                <Input
                  id="description"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border-2 border-gray-300 focus:border-black transition-all duration-300 focus:scale-105"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-black font-medium">
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="border-2 border-gray-300 focus:border-black transition-all duration-300 hover:scale-105">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-black">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="hover:bg-gray-100 transition-colors duration-200">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="text-black font-medium">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border-2 border-gray-300 focus:border-black transition-all duration-300 focus:scale-105"
                />
              </div>
            </div>
            <Button
              onClick={addExpense}
              className="w-full bg-black text-white hover:bg-gray-800 border-2 border-black button-press hover-lift"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className={`border-2 border-black hover-lift ${isLoaded ? "animate-slide-in-left stagger-1" : "opacity-0"}`}
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Receipt className="w-6 h-6 text-black mr-2" />
                <div className="text-2xl font-bold text-black number-counter">{expenses.length}</div>
              </div>
              <div className="text-gray-600">Total Expenses</div>
            </CardContent>
          </Card>
          <Card
            className={`border-2 border-black hover-lift ${isLoaded ? "animate-slide-in-left stagger-2" : "opacity-0"}`}
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="w-6 h-6 text-black mr-2" />
                <div className="text-2xl font-bold text-black number-counter">${totalExpenses.toFixed(2)}</div>
              </div>
              <div className="text-gray-600">Total Amount</div>
            </CardContent>
          </Card>
          <Card
            className={`border-2 border-black hover-lift ${isLoaded ? "animate-slide-in-left stagger-3" : "opacity-0"}`}
          >
            <CardContent className="p-6 text-center">
              <Button
                onClick={exportToExcel}
                disabled={expenses.length === 0 || isExporting}
                className="w-full bg-black text-white hover:bg-gray-800 border-2 border-black disabled:bg-gray-300 disabled:text-gray-500 button-press hover-lift"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export to Excel
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Expenses Table */}
        <Card className={`border-2 border-black hover-lift ${isLoaded ? "animate-fade-in-up stagger-2" : "opacity-0"}`}>
          <CardHeader className="bg-black text-white">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Expense History
            </CardTitle>
            <CardDescription className="text-gray-300">View and manage your recorded expenses</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {expenses.length === 0 ? (
              <div className="p-8 text-center text-gray-500 animate-pulse-gentle">
                No expenses recorded yet. Add your first expense above.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-gray-200">
                    <TableHead className="font-bold text-black">Date</TableHead>
                    <TableHead className="font-bold text-black">Description</TableHead>
                    <TableHead className="font-bold text-black">Category</TableHead>
                    <TableHead className="font-bold text-black text-right">Amount</TableHead>
                    <TableHead className="font-bold text-black text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense, index) => (
                    <TableRow
                      key={expense.id}
                      data-expense-id={expense.id}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition-all duration-300 hover:scale-[1.01] ${
                        newExpenseId === expense.id ? "new-expense" : ""
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <TableCell className="text-black">{expense.date}</TableCell>
                      <TableCell className="text-black">{expense.description}</TableCell>
                      <TableCell className="text-black">{expense.category}</TableCell>
                      <TableCell className="text-black text-right font-medium">${expense.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteExpense(expense.id)}
                          className="text-black hover:bg-red-100 border border-gray-300 button-press hover:border-red-300 transition-all duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2 border-black bg-gray-50 animate-bounce">
                    <TableCell colSpan={3} className="font-bold text-black">
                      Total
                    </TableCell>
                    <TableCell className="font-bold text-black text-right number-counter">
                      ${totalExpenses.toFixed(2)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
