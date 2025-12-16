import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentUploads } from "@/components/dashboard/RecentUploads";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Image, FileText, Box, Newspaper } from "lucide-react";
import { useEffect, useState } from "react";
import { imageApiGetAll, projectApi, reportsApi } from "@/lib/api";
import { set } from "date-fns";

interface ILength {
  images: number;
  reports: number;
  projects: number;
}

const Index = () => {
  const [recentImage, setRecentImage] = useState<number>(0);
  const [recentProject, setRecentProject] = useState<number>(0);
  const [recentReport, setRecentReport] = useState<number>(0);
  const [recentUploads, setRecentUploads] = useState<ILength | null>(null);

  // Fetch the length of each content type from the API and update stats accordingly
  useEffect(() => {
    try {
      const imageData = async () => {
        const resp = await imageApiGetAll();
        resp && resp.files
          ? setRecentImage(resp.files.length)
          : setRecentImage(0);
      };
      const reportData = async () => {
        const resp = await reportsApi.getAll();
        resp && resp.data?.files && setRecentReport(resp.data?.files.length);
      };
      const projectData = async () => {
        const resp = await projectApi.getAll();
        resp && resp.data?.files && setRecentProject(resp.data?.files.length);
      };
      imageData();
      reportData();
      projectData();
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  }, []);

  useEffect(() => {
    if (!recentImage) {
      setRecentUploads({
        images: 0,
        reports: recentReport,
        projects: recentProject,
      });
    } else if (!recentReport) {
      setRecentUploads({
        images: recentImage,
        reports: 0,
        projects: recentProject,
      });
    } else if (!recentProject) {
      setRecentUploads({
        images: recentImage,
        reports: recentReport,
        projects: 0,
      });
    } else {
      setRecentUploads({
        images: recentImage,
        reports: recentReport,
        projects: recentProject,
      });
    }
  }, [recentImage, recentReport, recentProject]);
  console.log("Total contents uploaded:", recentUploads);

  const stats = [
    {
      title: "Images Uploaded",
      value: recentUploads?.images || 0,
      icon: Image,
    },
    {
      title: "Reports Published",
      value: recentUploads?.reports || 0,
      icon: FileText,
    },
    {
      title: "3D Models",
      value: 0,
      icon: Box,
    },
    {
      title: "News Articles",
      value: recentUploads?.projects || 0,
      icon: Newspaper,
    },
  ];
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
            <div key={index} style={{ animationDelay: `${index * 100}ms` }}>
              <StatsCard {...stat} />
            </div>
          ))}
        </div>

        {/* Quick Actions */}

        {/* Recent Uploads */}
        <div className="grid gap-6 lg:grid-cols-2">
          <QuickActions />
          <RecentUploads />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
