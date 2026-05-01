"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { Confetti } from "@/components/animations/confetti";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";
import { formatCurrency } from "@/lib/currency";

export function BudgetProgress({ initialBudget, currentExpenses }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  const percentUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

  // Check if it's the end of the month
  const today = new Date();
  const isLastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() === today.getDate();
  const showVictory = isLastDayOfMonth && percentUsed < 100 && initialBudget;

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    await updateBudgetFn(amount);
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  return (
    <motion.div
      whileHover={{ 
        scale: 1.01,
        rotateX: 1,
        rotateY: -1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card className="glass-card neon-glow-purple border-white/20 h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-bold tracking-tight">
                Monthly Budget (Default Account)
              </CardTitle>
              {showVictory && (
                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/20 animate-bounce">
                  <Trophy className="h-3 w-3" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">Budget Master</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-32 h-8 glass-card border-purple-500/30"
                    placeholder="Enter amount"
                    autoFocus
                    disabled={isLoading}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-green-500/20"
                    onClick={handleUpdateBudget}
                    disabled={isLoading}
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-red-500/20"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ) : (
                <>
                  <CardDescription className="font-medium text-muted-foreground/80">
                    {initialBudget
                      ? `${formatCurrency(currentExpenses)} of ${formatCurrency(initialBudget.amount)} spent`
                      : "No budget set"}
                  </CardDescription>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                    className="h-6 w-6 hover:bg-purple-500/10"
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {initialBudget && (
            <div className="space-y-3">
              <div className="relative pt-2">
                <Progress
                  value={percentUsed}
                  extrastyles={`${
                    percentUsed >= 90
                      ? "bg-red-500"
                      : percentUsed >= 75
                        ? "bg-yellow-500"
                        : "bg-purple-500"
                  } shadow-[0_0_10px_rgba(168,85,247,0.3)]`}
                />
              </div>
              <p className="text-xs font-bold text-muted-foreground text-right tracking-tight">
                {percentUsed.toFixed(1)}% used
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      {showVictory && <Confetti />}
    </motion.div>
  );
}