import React, { useState } from "react";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { imageSchema } from "@/lib/validations";
import { IImage } from "../interfaces/interfaces";
import { useMutation } from "@tanstack/react-query";
import { imageApiCreate } from "@/lib/api";
import toast from "react-hot-toast";

const UploadImageForm = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: imageApiCreate,
    mutationKey: ["new image"],
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(imageSchema),
  });

  const [dragActive, setDragActive] = useState(false);
  const [previewName, setPreviewName] = useState("");

  const logFile = (data: IImage) => {
    mutate(data);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      setValue("image", file, { shouldValidate: true });
      setPreviewName(file.name);
    }
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file, { shouldValidate: true });
      setPreviewName(file.name);
    }
  };

  return (
    <form
      encType="multipart/form-data"
      onSubmit={handleSubmit(logFile)}
      className="rounded-xl bg-card p-6 shadow-card animate-slide-up space-y-6"
    >
      <div className="space-y-2 flex flex-col items-start justify-start gap-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="title"
        >
          Title
        </label>
        <input
          id="title"
          placeholder="Enter image collection title"
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2  flex flex-col items-start justify-start gap-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="alt"
        >
          Alt Text
        </label>
        <input
          id="alt"
          placeholder="Enter alt text for accessibility"
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
          {...register("alt")}
        />
        {errors.alt && (
          <p className="text-sm text-destructive">{errors.alt.message}</p>
        )}
      </div>

      <div className="space-y-2  flex flex-col items-start justify-start gap-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="category"
        >
          Category
        </label>
        <input
          placeholder="Define the category"
          type="text"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          {...register("category")}
        />
        {errors.category && (
          <p className="text-sm text-destructive">{errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2  flex flex-col items-start justify-start gap-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor=""
        >
          Upload image here
        </label>
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
            {...register("image")}
            onChange={handleFilePick}
          />
          {previewName && (
            <p className="text-sm text-gray-700">Selected: {previewName}</p>
          )}
        </div>
        {errors && errors.image ? (
          <p className="text-sm text-destructive">{errors.image.message}</p>
        ) : (
          ""
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
          <Upload className="mr-2 h-4 w-4" />
          Upload Image
        </button>
      </div>
    </form>
  );
};

export default UploadImageForm;
