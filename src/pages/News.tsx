import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { newsSchema, type INews } from "@/lib/validations";
import { newsApi } from "@/lib/api";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Textarea } from "@/components/ui/textarea";

const NewsForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<INews>({
    resolver: yupResolver(newsSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      date: "",
      category: "",
      description: "",
    },
  });

  // Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: newsApi.create,
    onSuccess: (data) => {
      toast.success(data.data.message);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: INews) => {
    mutate(data);
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
            {/* File Upload */}
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Featured Image <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setValue("file", file, { shouldValidate: true });
                  }
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
              {errors.file && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.file.message}
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register("title")}
                type="text"
                placeholder="Enter news title"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Excerpt <span className="text-red-500">*</span>
              </label>
              <Textarea
                {...register("excerpt")}
                rows={3}
                placeholder="Brief summary of the news article"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.excerpt && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.excerpt.message}
                </p>
              )}
            </div>

            {/* Date and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("date")}
                  type="date"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.date.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("category")}
                  type="text"
                  placeholder="e.g., Technology, Business"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                {...register("description")}
                rows={8}
                placeholder="Full article content"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center justify-center gap-2 rounded-md hover:bg-primary bg-primary/90 ease duration-300 py-2 px-5 text-white"
              >
                {isPending ? "Submitting..." : "Publish News Article"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewsForm;
