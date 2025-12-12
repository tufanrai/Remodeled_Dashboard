import DashboardLayout from "@/components/layout/DashboardLayout";
import { FileUploadZone } from "@/components/upload/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Box } from "lucide-react";
import { toast } from "sonner";
import { modelSchema, type IModel } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const Upload3DModels = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IModel>({
    resolver: yupResolver(modelSchema),
    defaultValues: {
      file: "",
      previewImage: "",
      name: "",
      description: "",
    },
  });

  const handleModelFileSelect = (files: File[]) => {
    if (files.length > 0) {
      const fileUrl = URL.createObjectURL(files[0]);
      setValue("file", fileUrl, { shouldValidate: true });
    }
  };

  const handlePreviewFileSelect = (files: File[]) => {
    if (files.length > 0) {
      const fileUrl = URL.createObjectURL(files[0]);
      setValue("previewImage", fileUrl, { shouldValidate: true });
    }
  };

  const onSubmit = (data: IModel) => {
    console.log("3D Model Form Data:", data);
    toast.success("3D Model data logged to console");
    reset();
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold tracking-tight">
            Upload 3D Models
          </h1>
          <p className="text-muted-foreground">
            Upload project 3D models (GLB, FBX, OBJ formats)
          </p>
        </div>

        <div className="max-w-2xl">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-xl bg-card p-6 shadow-card animate-slide-up space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="modelName">Model Name</Label>
              <Input
                id="modelName"
                placeholder="Enter 3D model name"
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter model description"
                className={`bg-muted/30 min-h-[100px] ${
                  errors.description ? "border-destructive" : ""
                }`}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <FileUploadZone
                accept=".glb,.fbx,.obj,.gltf"
                multiple={false}
                maxFiles={1}
                label="Upload 3D File"
                onFilesSelected={handleModelFileSelect}
              />
              {errors.file && (
                <p className="text-sm text-destructive">
                  {errors.file.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <FileUploadZone
                accept="image/*"
                multiple={false}
                maxFiles={1}
                label="Preview Image"
                onFilesSelected={handlePreviewFileSelect}
              />
              {errors.previewImage && (
                <p className="text-sm text-destructive">
                  {errors.previewImage.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Box className="mr-2 h-4 w-4" />
                {isSubmitting ? "Uploading..." : "Upload Model"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Upload3DModels;
