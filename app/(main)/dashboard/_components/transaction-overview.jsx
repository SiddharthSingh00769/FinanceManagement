"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ParticleGraph } from "@/components/animations/particle-graph";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency, formatSignedCurrency } from "@/lib/currency";
import { SpendingStrand } from "./spending-strand";
import { List, Activity, Film } from "lucide-react";
import { MonthlyReplay } from "./monthly-replay";
import { AnimatePresence } from "framer-motion";

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9FA8DA",
];

export function DashboardOverview({ accounts, transactions }) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );
  const [timeRange, setTimeRange] = useState("this-month");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'strand'
  const [isReplayOpen, setIsReplayOpen] = useState(false);

  // Calculate date range
  const getDateRange = (range) => {
    const now = new Date();
    switch (range) {
      case "this-month":
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case "1m":
        return new Date(now.setMonth(now.getMonth() - 1));
      case "3m":
        return new Date(now.setMonth(now.getMonth() - 3));
      case "6m":
        return new Date(now.setMonth(now.getMonth() - 6));
      case "1y":
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return null;
    }
  };

  const rangeDate = getDateRange(timeRange);

  // Filter transactions for selected account AND time range
  const accountTransactions = transactions.filter((t) => {
    const isAccountMatch = t.accountId === selectedAccountId;
    if (!isAccountMatch) return false;
    if (timeRange === "all") return true;
    return new Date(t.date) >= rangeDate;
  });

  // Get recent transactions (all for strand, 5 for table)
  const sortedTransactions = [...accountTransactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  const recentTransactions = sortedTransactions.slice(0, 5);

  const filteredExpenses = accountTransactions.filter((t) => t.type === "EXPENSE");

  // Group expenses by category
  const expensesByCategory = filteredExpenses.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {});

  // Format data for pie chart
  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  return (
    <div className="space-y-6">
      {/* Global Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 glass-card border-white/10 rounded-2xl">
         <div className="flex items-center gap-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Filtering</p>
            <div className="h-4 w-px bg-white/10" />
            <Select
              value={selectedAccountId}
              onValueChange={setSelectedAccountId}
            >
              <SelectTrigger className="w-[160px] h-9 glass-card border-white/10 font-bold text-xs">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent className="glass-card">
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id} className="text-xs">
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
         </div>

         <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] h-9 glass-card border-white/10 font-bold text-xs">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent className="glass-card">
              <SelectItem value="this-month" className="text-xs">Current Month</SelectItem>
              <SelectItem value="1m" className="text-xs">Last 1 Month</SelectItem>
              <SelectItem value="3m" className="text-xs">Last 3 Months</SelectItem>
              <SelectItem value="6m" className="text-xs">Last 6 Months</SelectItem>
              <SelectItem value="1y" className="text-xs">Last 1 Year</SelectItem>
              <SelectItem value="all" className="text-xs">All Time</SelectItem>
            </SelectContent>
         </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Transactions Card */}
        <Card className="glass-card border-white/20 overflow-hidden flex flex-col">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pb-6 border-b border-white/5">
            <CardTitle className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
              Financial History
            </CardTitle>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 shadow-inner">
                <button 
                  onClick={() => setViewMode("table")}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-xs font-bold",
                    viewMode === "table" ? "bg-white/10 text-white shadow-lg" : "text-muted-foreground hover:text-white"
                  )}
                >
                  <List className="h-3.5 w-3.5" />
                  List
                </button>
                <button 
                  onClick={() => setViewMode("strand")}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-xs font-bold",
                    viewMode === "strand" ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]" : "text-muted-foreground hover:text-white"
                  )}
                >
                  <Activity className="h-3.5 w-3.5" />
                  3D Strand
                </button>
              </div>

              <button 
                onClick={() => setIsReplayOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black uppercase italic shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <Film className="h-3.5 w-3.5 fill-current" />
                Watch Replay
              </button>
            </div>
          </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          {viewMode === "table" ? (
            <div className="space-y-4">
              {recentTransactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No recent transactions
                </p>
              ) : (
                recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold leading-none">
                        {transaction.description || "Untitled Transaction"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(transaction.date), "PP")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex items-center text-sm font-bold",
                          transaction.type === "EXPENSE"
                            ? "text-red-500"
                            : "text-green-500"
                        )}
                      >
                        {transaction.type === "EXPENSE" ? (
                          <ArrowDownRight className="mr-1 h-3 w-3" />
                        ) : (
                          <ArrowUpRight className="mr-1 h-3 w-3" />
                        )}
                        {formatSignedCurrency(transaction.amount, transaction.type)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="h-[400px] overflow-y-auto custom-scrollbar">
              <SpendingStrand transactions={sortedTransactions} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expense Breakdown Card */}
      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-bold tracking-tight">
            Expense Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-5">
          {pieChartData.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No expenses for this period
            </p>
          ) : (
            <div className="h-[400px] relative">
              <ParticleGraph data={pieChartData} />
            </div>
          )}
        </CardContent>
      </Card>
      </div>
      
      <AnimatePresence>
        {isReplayOpen && (
          <MonthlyReplay 
            transactions={accountTransactions} 
            timeRange={timeRange}
            onClose={() => setIsReplayOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}