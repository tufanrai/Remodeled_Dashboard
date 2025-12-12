import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";
import { EReports, IReports, reportsSchema } from "@/lib/validations";
import { reportsApi } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";

const reportTypes = [
  { label: "Annual", value: EReports.Annual },
  { label: "Semi-Annual", value: EReports.SemiAnnual },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

const UploadReports = () => {
  const [submittedData, setSubmittedData] = useState<IReports | null>(null);

  // Mutate data
  const { mutate, isPending } = useMutation({
    mutationFn: reportsApi.create,
    mutationKey: ["Upload new file"],
    onSuccess: () => {
      console.log("Report uploaded successfully!");
      reset();
      setSubmittedData(null);
    },
    onError: (error) => {
      console.error("Upload failed:", error);
    },
  });

  // Form setup with validation
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IReports>({
    resolver: yupResolver(reportsSchema),
    defaultValues: {
      title: "",
      date: "",
      pages: "",
      type: EReports.Annual,
    },
  });

  const SubmitData = (data: IReports) => {
    console.log("Form data:", data);
    console.log(data.file);
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
          <div className="rounded-xl bg-card p-6 shadow-card animate-slide-up">
            <form onSubmit={handleSubmit(SubmitData)} className="space-y-6">
              {/* Report Title */}
              <div className="space-y-2">
                <Label htmlFor="reportTitle">Report Title</Label>
                <Input
                  id="reportTitle"
                  placeholder="Enter report title"
                  className="bg-muted/30"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Report Type and Year */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="reportType">Report Type</Label>
                  <select
                    id="reportType"
                    className="flex h-10 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...register("type")}
                  >
                    <option value="">Select type</option>
                    {reportTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="text-sm text-destructive">
                      {errors.type.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <select
                    id="year"
                    className="flex h-10 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...register("date")}
                  >
                    <option value="">Select year</option>
                    {years.map((year) => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {errors.date && (
                    <p className="text-sm text-destructive">
                      {errors.date.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Total Pages */}
              <div className="space-y-2">
                <Label htmlFor="pages">Total Pages</Label>
                <Input
                  id="pages"
                  type="number"
                  min="1"
                  placeholder="e.g., 5"
                  className="bg-muted/30"
                  {...register("pages")}
                />
                {errors.pages && (
                  <p className="text-sm text-destructive">
                    {errors.pages.message}
                  </p>
                )}
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="file">Upload PDF Report</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf"
                  className="bg-muted/30"
                  {...register("file")}
                />
                {errors.file && (
                  <p className="text-sm text-destructive">
                    {errors.file.message}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset();
                    setSubmittedData(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  <FileText className="mr-2 h-4 w-4" />
                  {isPending ? "Uploading..." : "Submit"}
                </Button>
              </div>
            </form>

            {/* Display Submitted Data */}
            {submittedData && (
              <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
                <h2 className="text-lg font-semibold mb-3">Submitted Data:</h2>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Title:</span>{" "}
                    {submittedData.title}
                  </p>
                  <p>
                    <span className="font-medium">Type:</span>{" "}
                    {submittedData.type}
                  </p>
                  <p>
                    <span className="font-medium">Year:</span>{" "}
                    {submittedData.date}
                  </p>
                  <p>
                    <span className="font-medium">Pages:</span>{" "}
                    {submittedData.pages}
                  </p>
                  <p>
                    <span className="font-medium">File:</span>{" "}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadReports;
