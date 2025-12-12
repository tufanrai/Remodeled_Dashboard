import { Link } from "react-router-dom";
import {
  Image,
  Box,
  FileText,
  FolderOpen,
  Newspaper,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  {
    label: "Upload Images",
    path: "/images",
    icon: Image,
    color: "bg-info/10 text-info hover:bg-info/20",
  },
  {
    label: "Add 3D Model",
    path: "/models",
    icon: Box,
    color: "bg-warning/10 text-warning hover:bg-warning/20",
  },
  {
    label: "Upload Report",
    path: "/reports",
    icon: FileText,
    color: "bg-success/10 text-success hover:bg-success/20",
  },
  {
    label: "Add Project",
    path: "/projects",
    icon: FolderOpen,
    color: "bg-primary/10 text-primary hover:bg-primary/20",
  },
  {
    label: "Post News",
    path: "/news",
    icon: Newspaper,
    color: "bg-accent/10 text-accent hover:bg-accent/20",
  },
];

export function QuickActions() {
  return (
    <div className="rounded-xl bg-card p-6 shadow-card animate-slide-up">
      <h3 className="mb-6 text-lg font-semibold">Quick Actions</h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
        {actions.map((action) => (
          <Link
            key={action.path}
            to={action.path}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl p-4 transition-all duration-200",
              action.color
            )}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/50">
              <action.icon className="h-6 w-6" />
            </div>
            <span className="text-xs font-medium text-center">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
