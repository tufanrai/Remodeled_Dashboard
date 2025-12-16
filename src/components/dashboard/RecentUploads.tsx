import { Image, FileText, Box, TrafficCone } from "lucide-react";
import { cn } from "@/lib/utils";
import { imageApiGetAll, projectApi, reportsApi } from "@/lib/api";
import { useEffect, useState } from "react";

interface IImage {
  createdAt: string;
  alt: string;
  category: string;
}

interface IProject {
  title: string;
  status: string;
  createdAt: string;
}

interface IReports {
  title: string;
  type: string;
  createdAt: string;
}

export function RecentUploads() {
  const [recentImage, setRecentImage] = useState<IImage | null>(null);
  const [recentProject, setRecentProject] = useState<IProject | null>(null);
  const [recentReport, setRecentReport] = useState<IReports | null>(null);
  const [recentUploads, setRecentUploads] = useState<any | null>(null);

  // Fetch recent uploads logic can be added here
  useEffect(() => {
    try {
      const imageData = async () => {
        const resp = await imageApiGetAll();
        console.log("image:", resp.files);
        resp && resp.files && setRecentImage(resp.files[0]);
      };
      const reportData = async () => {
        const resp = await reportsApi.getAll();
        resp && resp.data?.files && setRecentReport(resp.data?.files[0]);
      };
      const projectData = async () => {
        const resp = await projectApi.getAll();
        resp && resp.data?.files && setRecentProject(resp.data?.files[0]);
      };
      imageData();
      reportData();
      projectData();
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    if (recentImage && recentReport && recentProject) {
      setRecentUploads([recentImage, recentReport, recentProject]);
      return;
    }
  }, [recentImage, recentReport, recentProject]);

  const recentItems = [
    {
      id: 1,
      name: "Construction Site Photo Set",
      type: "image",
      date: "2 hours ago",
      icon: Image,
      color: "text-info",
      bg: "bg-info/10",
    },
    {
      id: 2,
      name: "Annual Report 2024",
      type: "report",
      date: "5 hours ago",
      icon: FileText,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      id: 3,
      name: "Dam 3D Model v2",
      type: "model",
      date: "1 day ago",
      icon: Box,
      color: "text-warning",
      bg: "bg-warning/10",
    },
  ];

  return (
    <div className="rounded-xl bg-card p-6 shadow-card animate-slide-up">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Uploads</h3>
        <button className="text-sm font-medium text-primary hover:underline">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {recentUploads && recentUploads != null ? (
          <>
            {recentUploads.map((item: any, index: number) => (
              <>
                <div
                  key={index}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className="group flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
                >
                  <div
                    className={cn(
                      `flex h-10 w-10 items-center justify-center rounded-lg ${
                        item.alt
                          ? "bg-info/10 text-info"
                          : item.type
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }`
                    )}
                  >
                    {item.alt ? (
                      <Image className="h-6 w-6" />
                    ) : item.type ? (
                      <FileText className="h-6 w-6" />
                    ) : (
                      <TrafficCone className="h-6 w-6" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">
                      {item.title ?? item.alt}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {item.category ??
                        item.type ??
                        item.technicalSpecs.at(0).Type}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {item.createdAt.split("T")[0]}
                  </span>
                </div>
              </>
            ))}
          </>
        ) : (
          "Nothing to show"
        )}
      </div>
    </div>
  );
}
