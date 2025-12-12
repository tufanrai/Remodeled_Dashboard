import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { UserPlus, Pencil, Trash2, Eye, EyeOff, Shield } from "lucide-react";
import { toast } from "sonner";
import { adminSchema, type IAdmin } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface Admin {
  id: string;
  name: string;
  email: string;
  contact: string;
  password: string;
  createdAt: string;
}

const mockAdmins: Admin[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@maulakalika.com",
    contact: "+977-9841234567",
    password: "password123",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@maulakalika.com",
    contact: "+977-9851234567",
    password: "admin456",
    createdAt: "2024-02-20",
  },
];

const AdminManagement = () => {
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>(
    {}
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IAdmin>({
    resolver: yupResolver(adminSchema),
    defaultValues: {
      name: "",
      email: "",
      contact: "",
      password: "",
    },
  });

  const resetForm = () => {
    reset();
  };

  const onAddSubmit = (data: IAdmin) => {
    console.log("Add Admin Form Data:", data);
    const newAdmin: Admin = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      contact: data.contact,
      password: data.password,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setAdmins([...admins, newAdmin]);
    setShowAddDialog(false);
    resetForm();
    toast.success("Admin created successfully");
  };

  const onEditSubmit = (data: IAdmin) => {
    if (!selectedAdmin) return;
    console.log("Edit Admin Form Data:", data);
    setAdmins(
      admins.map((a) => (a.id === selectedAdmin.id ? { ...a, ...data } : a))
    );
    setShowEditDialog(false);
    setSelectedAdmin(null);
    resetForm();
    toast.success("Admin updated successfully");
  };

  const handleDelete = () => {
    if (!selectedAdmin) return;
    setAdmins(admins.filter((a) => a.id !== selectedAdmin.id));
    setShowDeleteDialog(false);
    setSelectedAdmin(null);
    toast.success("Admin deleted successfully");
  };

  const openEditDialog = (admin: Admin) => {
    setSelectedAdmin(admin);
    setValue("name", admin.name);
    setValue("email", admin.email);
    setValue("contact", admin.contact);
    setValue("password", admin.password);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (admin: Admin) => {
    setSelectedAdmin(admin);
    setShowDeleteDialog(true);
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openAddDialog = () => {
    resetForm();
    setShowAddDialog(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Admin Management
            </h1>
            <p className="text-muted-foreground">
              Manage admin accounts and permissions
            </p>
          </div>
          <Button onClick={openAddDialog}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Admin
          </Button>
        </div>

        <div className="rounded-xl bg-card shadow-card overflow-hidden animate-slide-up">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.contact}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">
                        {showPasswords[admin.id] ? admin.password : "••••••••"}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => togglePasswordVisibility(admin.id)}
                      >
                        {showPasswords[admin.id] ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{admin.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(admin)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(admin)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Admin Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Add New Admin</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onAddSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="Enter full name"
                className={`bg-muted/30 ${
                  errors.name ? "border-destructive" : ""
                }`}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter email address"
                className={`bg-muted/30 ${
                  errors.email ? "border-destructive" : ""
                }`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Contact</Label>
              <Input
                placeholder="Enter phone number"
                className={`bg-muted/30 ${
                  errors.contact ? "border-destructive" : ""
                }`}
                {...register("contact")}
              />
              {errors.contact && (
                <p className="text-sm text-destructive">
                  {errors.contact.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter password"
                className={`bg-muted/30 ${
                  errors.password ? "border-destructive" : ""
                }`}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Create Admin
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Admin Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                className={`bg-muted/30 ${
                  errors.name ? "border-destructive" : ""
                }`}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                className={`bg-muted/30 ${
                  errors.email ? "border-destructive" : ""
                }`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Contact</Label>
              <Input
                className={`bg-muted/30 ${
                  errors.contact ? "border-destructive" : ""
                }`}
                {...register("contact")}
              />
              {errors.contact && (
                <p className="text-sm text-destructive">
                  {errors.contact.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                className={`bg-muted/30 ${
                  errors.password ? "border-destructive" : ""
                }`}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Admin"
        description={`Are you sure you want to delete ${selectedAdmin?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </DashboardLayout>
  );
};

export default AdminManagement;
