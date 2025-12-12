import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentUploads } from "@/components/dashboard/RecentUploads";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Image, FileText, Box, Newspaper } from "lucide-react";

const stats = [
  {
    title: "Images Uploaded",
    value: 1284,
    icon: Image,
    trend: { value: 12.5, isPositive: true },
  },
  {
    title: "Reports Published",
    value: 48,
    icon: FileText,
    trend: { value: 8.2, isPositive: true },
  },
  {
    title: "3D Models",
    value: 24,
    icon: Box,
    trend: { value: 4.1, isPositive: true },
  },
  {
    title: "News Articles",
    value: 36,
    icon: Newspaper,
    trend: { value: 15.3, isPositive: true },
  },
];

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your content.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <StatsCard {...stat} />
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Uploads */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RecentUploads />

          {/* Activity Chart Placeholder */}
          <div className="rounded-xl bg-card p-6 shadow-card animate-slide-up">
            <h3 className="mb-6 text-lg font-semibold">Upload Activity</h3>
            <div className="flex h-64 items-center justify-center rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">
                Activity chart coming soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
