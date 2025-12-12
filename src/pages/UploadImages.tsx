import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";
import { imageSchema, IImage } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { imageApiCreate } from "@/lib/api";
import UploadImageForm from "@/components/cards/UploadImageForm";

const categories = [
  "Construction",
  "Site Visit",
  "Equipment",
  "Meeting",
  "General",
];

const UploadImages = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold tracking-tight">Upload Images</h1>
          <p className="text-muted-foreground">
            Upload project images with categorization
          </p>
        </div>

        <div className="max-w-2xl">
          <UploadImageForm />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadImages;
