import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText } from "lucide-react";
import { EReports, IReports, reportsSchema } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { reportsApi } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

// static values
const reportTypes = [
  { label: "Annual", value: EReports.Annual },
  { label: "Semi-Annual", value: EReports.SemiAnnual },
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

const UploadReportsForm = () => {
  // Mutation function
  const { mutate, isPending } = useMutation({
    mutationFn: reportsApi.create,
    mutationKey: ["new image"],
    onSuccess: (data) => {
      toast.success(data.data?.message);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  //   Form validator
  const {
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(reportsSchema),
  });

  //   file upload helpers
  const [dragActive, setDragActive] = useState(false);
  const [previewName, setPreviewName] = useState("");

  //   action function
  const logFile = (data: IReports) => {
    mutate(data);
  };

  //   utility helper
  const reportType = watch("type");
  const date = watch("date");

  // file drag and drop action handler
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      setValue("file", file, { shouldValidate: true });
      setPreviewName(file.name);
    }
  };

  //   file choosing handler
  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("file", file, { shouldValidate: true });
      setPreviewName(file.name);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(logFile)}
      className="rounded-xl bg-card p-6 shadow-card animate-slide-up space-y-6"
    >
      <div className="space-y-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="reportTitle"
        >
          Report Title
        </label>
        <input
          id="reportTitle"
          placeholder="Enter report title"
          {...register("title")}
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="reportType"
          >
            Report Type
          </label>
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
            <p className="text-sm text-destructive">{errors.type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="year"
          >
            Year
          </label>
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
            <p className="text-sm text-destructive">{errors.date.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="pages"
        >
          Total Pages
        </label>
        <input
          id="pages"
          type="number"
          min="1"
          placeholder="e.g., 5"
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
          {...register("pages")}
        />
        {errors.pages && (
          <p className="text-sm text-destructive">{errors.pages.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput")?.click()}
          className={`w-full p-8 border-2 border-dashed rounded-md text-center cursor-pointer
          ${dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300"}`}
        >
          <p className="text-gray-600">
            Drag & drop your file here or click to upload
          </p>

          <input
            id="fileInput"
            type="file"
            className="hidden"
            {...register("file")}
            onChange={handleFilePick}
          />
          {previewName && (
            <p className="text-sm text-gray-700">Selected: {previewName}</p>
          )}
        </div>
        {errors.file && (
          <p className="text-sm text-destructive">{errors.file.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          className="flex items-center justify-center py-2 px-5 text-white bg-red-600 rounded-md hover:bg-red-700 ease duration-300"
          type="reset"
        >
          Cancel
        </button>
        <button
          className="flex items-center justify-center gap-2 rounded-md hover:bg-primary bg-primary/90 ease duration-300 py-2 px-5 text-white"
          type="submit"
        >
          <FileText className="mr-2 h-4 w-4" />
          Upload Report
        </button>
      </div>
    </form>
  );
};

export default UploadReportsForm;
