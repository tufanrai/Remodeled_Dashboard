import DashboardLayout from "@/components/layout/DashboardLayout";
import { FileUploadZone } from "@/components/upload/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import { reportsSchema, EReports, type IReports } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const reportTypes = [
  { label: "Annual", value: EReports.Annual },
  { label: "Semi-Annual", value: EReports.SemiAnnual },
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

const UploadReports = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IReports>({
    resolver: yupResolver(reportsSchema),
    defaultValues: {
      file: "",
      title: "",
      type: undefined,
      date: "",
      pages: "",
    },
  });

  const reportType = watch("type");
  const date = watch("date");

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      const fileUrl = URL.createObjectURL(files[0]);
      setValue("file", fileUrl, { shouldValidate: true });
    }
  };

  const onSubmit = (data: IReports) => {
    console.log("Report Form Data:", data);
    toast.success("Report data logged to console");
    reset();
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold tracking-tight">Upload Reports</h1>
          <p className="text-muted-foreground">
            Upload annual and semi-annual reports
          </p>
        </div>

        <div className="max-w-2xl">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-xl bg-card p-6 shadow-card animate-slide-up space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="reportTitle">Report Title</Label>
              <Input
                id="reportTitle"
                placeholder="Enter report title"
                className={`bg-muted/30 ${
                  errors.title ? "border-destructive" : ""
                }`}
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <Select
                  value={reportType}
                  onValueChange={(value) =>
                    setValue("type", value as EReports, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger
                    className={`bg-muted/30 ${
                      errors.type ? "border-destructive" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border shadow-lg">
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-destructive">
                    {errors.type.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select
                  value={date}
                  onValueChange={(value) =>
                    setValue("date", value, { shouldValidate: true })
                  }
                >
                  <SelectTrigger
                    className={`bg-muted/30 ${
                      errors.date ? "border-destructive" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border shadow-lg">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.date && (
                  <p className="text-sm text-destructive">
                    {errors.date.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pages">Total Pages</Label>
              <Input
                id="pages"
                type="number"
                min="1"
                placeholder="e.g., 5"
                className={`bg-muted/30 ${
                  errors.pages ? "border-destructive" : ""
                }`}
                {...register("pages")}
              />
              {errors.pages && (
                <p className="text-sm text-destructive">
                  {errors.pages.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <FileUploadZone
                accept=".pdf"
                multiple={false}
                maxFiles={1}
                label="Upload PDF Report"
                onFilesSelected={handleFileSelect}
              />
              {errors.file && (
                <p className="text-sm text-destructive">
                  {errors.file.message}
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
                <FileText className="mr-2 h-4 w-4" />
                {isSubmitting ? "Uploading..." : "Upload Report"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadReports;
