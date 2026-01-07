import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Shield, Save } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IAdmin } from "@/components/interfaces/interfaces";
import { useEffect, useState } from "react";
import { AdminData, getAdminsData } from "@/components/api/auth.api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "@/lib/validations";

interface IUser {
  name: string;
  email: string;
  role: string;
}

const Settings = () => {
  // Display data
  const [admin, setAdmin] = useState<IUser | undefined>(undefined);
  const { data } = useQuery({
    queryKey: ["Fetch the data"],
    queryFn: getAdminsData,
  });
  useEffect(() => {
    setAdmin({
      name: data?.data?.name,
      email: data?.data?.email,
      role: data?.data?.role,
    });
  }, [data]);

  // Update data
  const { mutate } = useMutation({
    mutationFn: AdminData,
  });

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(registerSchema),
  });
  // get the data
  const updateData = (data: IUser) => {
    console.log(data);
  };
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Profile Section */}
          <div className="rounded-xl bg-card p-6 shadow-card animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Profile Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Update your account details
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Full Name</Label>
                  <Input
                    id="firstName"
                    defaultValue={admin == undefined ? "" : admin.name}
                    {...register("name")}
                    className="bg-muted/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Role</Label>
                  <Input
                    id="lastName"
                    defaultValue={admin == undefined ? "" : admin.role}
                    {...register("role")}
                    className="bg-muted/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={admin == undefined ? "" : admin.email}
                  {...register("email")}
                  className="bg-muted/30"
                />
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="rounded-xl bg-card p-6 shadow-card animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Security</h3>
                <p className="text-sm text-muted-foreground">
                  Update password and security settings
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  className="bg-muted/30"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    className="bg-muted/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="bg-muted/30"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button size="lg">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
