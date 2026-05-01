import { Suspense } from "react";
import { getUserAccounts } from "@/actions/dashboard";
import { getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DashboardOverview } from "./_components/transaction-overview";
import AccountCard from "./_components/account-card";
import CreateAccountDrawer from "@/components/create-account-drawer";
import { BudgetProgress } from "./_components/budget-progres";
import { ErrorBoundary } from "@/components/error-boundary";
import {
  AccountCardSkeleton,
  BudgetSkeleton,
  OverviewSkeleton,
} from "./_components/dashboard-skeleton";
import { AnimatedGrid, AnimatedGridItem } from "@/components/animations/animated-grid";
import { StreakWidget } from "./_components/streak-widget";
import { DailyWisdom } from "./_components/daily-wisdom";

async function AccountsGrid() {
  const accounts = await getUserAccounts();

  return (
    <>
      <CreateAccountDrawer>
        <Card className="glass-card hover:shadow-lg transition-all cursor-pointer border-dashed h-full group">
          <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full py-10">
            <div className="p-3 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors mb-3">
              <Plus className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-sm font-semibold text-foreground">Add New Account</p>
            <p className="text-xs text-muted-foreground mt-1 text-center px-4">Create a new source to track your money</p>
          </CardContent>
        </Card>
      </CreateAccountDrawer>
      {accounts.length > 0 &&
        accounts?.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
    </>
  );
}

async function BudgetSection() {
  const accounts = await getUserAccounts();
  const defaultAccount = accounts?.find((account) => account.isDefault);

  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  return (
    <BudgetProgress
      initialBudget={budgetData?.budget}
      currentExpenses={budgetData?.currentExpenses || 0}
    />
  );
}

async function OverviewSection() {
  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);

  return (
    <DashboardOverview
      accounts={accounts}
      transactions={transactions || []}
    />
  );
}

import { SuccessGalaxy } from "./_components/success-galaxy";

export default async function DashboardPage() {
  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);

  return (
    <div className="relative min-h-screen">
      {/* Background: The Galaxy of Success */}
      <SuccessGalaxy accounts={accounts} transactions={transactions || []} />

      <AnimatedGrid className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
        {/* Budget Progress - Bento Item 1 */}
        <AnimatedGridItem className="md:col-span-6">
          <ErrorBoundary>
            <Suspense fallback={<BudgetSkeleton />}>
              <BudgetSection />
            </Suspense>
          </ErrorBoundary>
        </AnimatedGridItem>

        {/* Streak Widget - Bento Item 2 */}
        <AnimatedGridItem className="md:col-span-3">
          <StreakWidget />
        </AnimatedGridItem>

        {/* Daily Wisdom - Bento Item 3 (Tarot Card) */}
        <AnimatedGridItem className="md:col-span-3 h-full">
           <DailyWisdom />
        </AnimatedGridItem>

        {/* Accounts Section - Bento Item 3 (Full Width) */}
        <AnimatedGridItem className="md:col-span-12">
          <div className="space-y-4">
             <h2 className="text-xl font-bold gradient-title">Your Accounts</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ErrorBoundary>
                  <Suspense
                    fallback={
                      <>
                        <AccountCardSkeleton />
                        <AccountCardSkeleton />
                        <AccountCardSkeleton />
                      </>
                    }
                  >
                    <AccountsGrid />
                  </Suspense>
                </ErrorBoundary>
             </div>
          </div>
        </AnimatedGridItem>

        {/* Dashboard Overview - Bento Item 4 (Large) */}
        <AnimatedGridItem className="md:col-span-12">
          <ErrorBoundary>
            <Suspense fallback={<OverviewSkeleton />}>
              <OverviewSection />
            </Suspense>
          </ErrorBoundary>
        </AnimatedGridItem>
      </AnimatedGrid>
    </div>
  );
}