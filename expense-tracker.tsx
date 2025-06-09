"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Download, Plus } from "lucide-react"
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

  const addExpense = () => {
    if (!amount || !description || !category) return

    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: Number.parseFloat(amount),
      description,
      category,
      date,
    }

    setExpenses([...expenses, newExpense])
    setAmount("")
    setDescription("")
    setCategory("")
    setDate(new Date().toISOString().split("T")[0])
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  const exportToExcel = () => {
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
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black mb-2">Expense Tracker</h1>
          <p className="text-gray-600">Track your expenses and export to Excel</p>
        </div>

        {/* Add Expense Form */}
        <Card className="border-2 border-black">
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
                  className="border-2 border-gray-300 focus:border-black"
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
                  className="border-2 border-gray-300 focus:border-black"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-black font-medium">
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="border-2 border-gray-300 focus:border-black">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-black">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="hover:bg-gray-100">
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
                  className="border-2 border-gray-300 focus:border-black"
                />
              </div>
            </div>
            <Button onClick={addExpense} className="w-full bg-black text-white hover:bg-gray-800 border-2 border-black">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-2 border-black">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-black">{expenses.length}</div>
              <div className="text-gray-600">Total Expenses</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-black">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-black">${totalExpenses.toFixed(2)}</div>
              <div className="text-gray-600">Total Amount</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-black">
            <CardContent className="p-6 text-center">
              <Button
                onClick={exportToExcel}
                disabled={expenses.length === 0}
                className="w-full bg-black text-white hover:bg-gray-800 border-2 border-black disabled:bg-gray-300 disabled:text-gray-500"
              >
                <Download className="w-4 h-4 mr-2" />
                Export to Excel
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Expenses Table */}
        <Card className="border-2 border-black">
          <CardHeader className="bg-black text-white">
            <CardTitle>Expense History</CardTitle>
            <CardDescription className="text-gray-300">View and manage your recorded expenses</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {expenses.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
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
                  {expenses.map((expense) => (
                    <TableRow key={expense.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <TableCell className="text-black">{expense.date}</TableCell>
                      <TableCell className="text-black">{expense.description}</TableCell>
                      <TableCell className="text-black">{expense.category}</TableCell>
                      <TableCell className="text-black text-right font-medium">${expense.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteExpense(expense.id)}
                          className="text-black hover:bg-gray-200 border border-gray-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2 border-black bg-gray-50">
                    <TableCell colSpan={3} className="font-bold text-black">
                      Total
                    </TableCell>
                    <TableCell className="font-bold text-black text-right">${totalExpenses.toFixed(2)}</TableCell>
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
