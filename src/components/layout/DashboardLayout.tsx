import { ReactNode, useEffect, useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { Bell, Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import WithAuthorization from "../hoc/HigherOrderFunction";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface IUser {
  name: string;
  email: string;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<IUser>({
    name: "Admin",
    email: "admin@example.com",
  });

  // Remove token
  const remvoeToken = () => {
    Cookies.remove("access")!;
    localStorage.removeItem("amdin")!;
  };

  // Fetch data of the user
  useEffect(() => {
    const { name, email }: IUser = JSON.parse(localStorage.getItem("amdin"));

    if (!name && !email) {
      setUser({
        name: "Admin",
        email: "admin@example.com",
      });
      return;
    }
    setUser({ name, email });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />

      {/* Main Content */}
      <div className="pl-16 lg:pl-64 transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/80 backdrop-blur-sm px-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search files, reports..."
                className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {user.name.split("").at(0)}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-card border shadow-lg"
              >
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to={"/settings"}>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link onClick={remvoeToken} to={"/auth/login"}>
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default WithAuthorization(DashboardLayout, ["Admin", "Super admin"]);
