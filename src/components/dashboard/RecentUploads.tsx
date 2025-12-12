import { Image, FileText, Box, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

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
  {
    id: 4,
    name: "AGM 2024 Photos",
    type: "agm",
    date: "2 days ago",
    icon: Calendar,
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

export function RecentUploads() {
  return (
    <div className="rounded-xl bg-card p-6 shadow-card animate-slide-up">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Uploads</h3>
        <button className="text-sm font-medium text-primary hover:underline">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {recentItems.map((item, index) => (
          <div
            key={item.id}
            className="group flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", item.bg)}>
              <item.icon className={cn("h-5 w-5", item.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
            </div>
            <span className="text-xs text-muted-foreground">{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
