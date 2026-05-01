import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AccountCardSkeleton() {
  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24 bg-muted/20" />
        <Skeleton className="h-5 w-10 rounded-full bg-muted/20" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-32 mb-2 bg-muted/20" />
        <Skeleton className="h-3 w-20 bg-muted/20" />
      </CardContent>
      <div className="px-6 pb-4 flex justify-between">
        <Skeleton className="h-4 w-16 bg-muted/20" />
        <Skeleton className="h-4 w-16 bg-muted/20" />
      </div>
    </Card>
  );
}

export function BudgetSkeleton() {
  return (
    <Card className="glass-card h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-48 bg-muted/20" />
          <Skeleton className="h-3 w-36 bg-muted/20" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-3 w-full rounded-full bg-muted/20" />
        <div className="flex justify-end mt-2">
          <Skeleton className="h-3 w-16 bg-muted/20" />
        </div>
      </CardContent>
    </Card>
  );
}

export function OverviewSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Recent Transactions Skeleton */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <Skeleton className="h-5 w-36 bg-muted/20" />
          <Skeleton className="h-8 w-[140px] bg-muted/20" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 bg-muted/20" />
                  <Skeleton className="h-3 w-20 bg-muted/20" />
                </div>
                <Skeleton className="h-5 w-20 bg-muted/20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Particle Graph Skeleton */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <Skeleton className="h-5 w-48 bg-muted/20" />
          <Skeleton className="h-8 w-[120px] bg-muted/20" />
        </CardHeader>
        <CardContent className="p-0 pb-5">
          <div className="h-[400px] flex items-center justify-center">
            <Skeleton className="h-64 w-64 rounded-full bg-muted/20" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-pulse">
        {/* Budget */}
        <div className="md:col-span-8">
           <BudgetSkeleton />
        </div>

        {/* Streak */}
        <div className="md:col-span-4">
           <Card className="glass-card h-full h-[140px]">
              <CardContent className="flex items-center gap-4 h-full">
                 <Skeleton className="h-12 w-12 rounded-full bg-muted/20" />
                 <div className="space-y-2">
                    <Skeleton className="h-6 w-20 bg-muted/20" />
                    <Skeleton className="h-4 w-32 bg-muted/20" />
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Accounts */}
        <div className="md:col-span-12 space-y-4">
           <Skeleton className="h-8 w-48 bg-muted/20" />
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AccountCardSkeleton />
              <AccountCardSkeleton />
              <AccountCardSkeleton />
           </div>
        </div>

        {/* Overview */}
        <div className="md:col-span-12">
           <OverviewSkeleton />
        </div>
      </div>
    </div>
  );
}
