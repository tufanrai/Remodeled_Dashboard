import { useEffect, useState } from "react";
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
import { UserPlus, Pencil, Trash2, Shield } from "lucide-react";
import { toast } from "react-hot-toast";
import { ERoles, registerSchema } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SuperAdminAuthorization from "@/components/hoc/SuperAdminAuth";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { registerApi } from "@/lib/api";
import { IRegister } from "@/components/interfaces/interfaces";

interface Admin extends IRegister {
  _id: string;
  name: string;
  email: string;
  contact: string;
  role: ERoles;
  password: string;
  createdAt?: string;
}

const Admins: Admin[] = [];

const AdminManagement = () => {
  const [admins, setAdmins] = useState<Admin[] | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<IRegister | null>(null);
  const queryClient = new QueryClient();

  // Fetch list of admins from API can be added here
  const { data } = useQuery({
    queryKey: ["admins"],
    queryFn: registerApi.getAll,
  });

  useEffect(() => {
    if (data?.data && data?.data && data?.data?.data) {
      toast.success(data?.data?.message);
      const newAdmins = [data?.data?.data];
      setAdmins(newAdmins);
    }
  }, [data]);

  // Form setup using react-hook-form and yup
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      contact: "",
    },
  });

  const resetForm = () => {
    reset();
  };

  // New admin's data mutation function
  const { mutate } = useMutation({
    mutationFn: registerApi.create,
    mutationKey: ["register-admin"],
    onSuccess: (data) => {
      toast.success("Admin created successfully");
      setShowAddDialog(false);
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      reset();
    },
    onError: (err) => {
      toast.error(err.name);
    },
  });

  // Admin's data update mutation function
  const updateAdminsData = useMutation({
    mutationFn: registerApi.update,
    mutationKey: ["update-admin"],
    onSuccess: (data) => {
      toast.success("Admin updated successfully");
      setShowEditDialog(false);
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (err) => {
      toast.error(err.name);
    },
  });

  // Delete admin mutation function
  const deleteAdminData = useMutation({
    mutationFn: registerApi.delete,
    mutationKey: ["delete-admin"],
    onSuccess: (data) => {
      toast.success("Admin deleted successfully");
      setShowDeleteDialog(false);
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (err) => {
      toast.error(err.name);
    },
  });

  // Submit function
  const onAddSubmit = (submitedValues: IRegister) => {
    mutate(submitedValues);
  };

  // Edit submit function
  const onEditSubmit = (toUpdateValue: IRegister) => {
    updateAdminsData.mutate(toUpdateValue);
    console.log(toUpdateValue);
  };

  // Delete function
  const handleDelete = () => {
    // @ts-ignore
    deleteAdminData.mutate(selectedAdmin?._id as string);
  };

  // Open dialogs
  const openEditDialog = (admin: IRegister) => {
    setSelectedAdmin(admin);
    setValue("name", admin.name);
    setValue("email", admin.email);
    setValue("contact", admin.contact);
    setValue("role", admin.role);
    setShowEditDialog(true);
  };

  // Open delete dialog
  const openDeleteDialog = (admin: IRegister) => {
    setSelectedAdmin(admin);
    setShowDeleteDialog(true);
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

        {/* Admins list */}
        <div className="rounded-xl bg-card shadow-card overflow-hidden animate-slide-up">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins && admins != null ? (
                <>
                  {/* @ts-ignore */}
                  {admins[0]?.map((admin, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        {admin.name}
                      </TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{admin.contact}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">
                            {admin.role}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{admin.createdAt.split("T")[0]}</TableCell>
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
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No admins found.
                  </TableCell>
                </TableRow>
              )}
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
            <div className="space-y-2">
              <Label>Role</Label>
              <Input
                type="text"
                placeholder="Enter role"
                className={`bg-muted/30 ${
                  errors.role ? "border-destructive" : ""
                }`}
                {...register("role")}
              />
              {errors.role && (
                <p className="text-sm text-destructive">
                  {errors.role.message}
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
              <Button type="submit">Create Admin</Button>
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
                defaultValue={selectedAdmin?.name ?? ""}
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
                defaultValue={selectedAdmin?.email ?? ""}
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
                defaultValue={selectedAdmin?.contact ?? ""}
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
                defaultValue={selectedAdmin?.password ?? ""}
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
            <div className="space-y-2">
              <Label>Role</Label>
              <Input
                defaultValue={selectedAdmin?.role ?? ERoles.Admin}
                className={`bg-muted/30 ${
                  errors.role ? "border-destructive" : ""
                }`}
                {...register("role")}
              />
              {errors.role && (
                <p className="text-sm text-destructive">
                  {errors.role.message}
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
              <Button
                type="submit"
                onClick={() =>
                  // @ts-ignore
                  sessionStorage.setItem("admin", selectedAdmin?._id)
                }
                disabled={isSubmitting}
              >
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

// export default SuperAdminAuthorization(AdminManagement, ["Super admin"]);
export default AdminManagement;
