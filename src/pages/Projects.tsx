import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { EStatus, IProject, projectSchema } from "@/lib/validations";
import { projectApi } from "@/lib/api";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";

const ProjectForm = () => {
  const [currentFeature, setCurrentFeature] = useState("");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<IProject>({
    resolver: yupResolver(projectSchema),
    defaultValues: {
      features: [],
      timeline: [{ year: "", milestone: "" }],
      technicalSpecs: {
        Type: "",
        headHeight: "",
        turbineType: "",
        annualGeneration: "",
        gridConnection: "",
      },
    },
  });

  const {
    fields: timelineFields,
    append: appendTimeline,
    remove: removeTimeline,
  } = useFieldArray({
    control,
    name: "timeline",
  });

  const features = watch("features") || [];

  // Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: projectApi.create,
    onSuccess: (data) => {
      toast.success(data?.data.message);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: IProject) => {
    mutate(data);
  };

  const addFeature = () => {
    if (currentFeature.trim()) {
      setValue("features", [...features, currentFeature.trim()]);
      setCurrentFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setValue(
      "features",
      features.filter((_, i) => i !== index)
    );
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
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Basic Information
              </h2>

              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Title
                </label>
                <input
                  {...register("title")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Description
                </label>
                <Textarea
                  {...register("description")}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Capacity
                  </label>
                  <input
                    {...register("capacity")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                  {errors.capacity && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.capacity.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select status</option>
                    {Object.values(EStatus).map((status) => (
                      <option key={status} value={status}>
                        {status.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                  {errors.status && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.status.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Location
                  </label>
                  <input
                    {...register("location")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.location.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Start Year
                  </label>
                  <input
                    {...register("startYear")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                  {errors.startYear && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startYear.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Full Description
                </label>
                <Textarea
                  {...register("fullDescription")}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.fullDescription && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullDescription.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Project Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setValue("file", file);
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
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">Features</h2>

              <div className="flex gap-2">
                <input
                  value={currentFeature}
                  onChange={(e) => setCurrentFeature(e.target.value)}
                  placeholder="Add a feature"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addFeature())
                  }
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center justify-center gap-2 rounded-md hover:bg-primary bg-primary/90 ease duration-300 py-2 px-5 text-white"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-50 p-2 rounded"
                  >
                    <span className="flex-1">{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="flex items-center justify-center py-2 px-5 text-white bg-red-600 rounded-md hover:bg-red-700 ease duration-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              {errors.features && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.features.message}
                </p>
              )}
            </div>

            {/* Technical Specs */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Technical Specifications
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Type
                  </label>
                  <input
                    {...register("technicalSpecs.Type")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                  {errors.technicalSpecs?.Type && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.technicalSpecs.Type.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Head Height
                  </label>
                  <input
                    {...register("technicalSpecs.headHeight")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                  {errors.technicalSpecs?.headHeight && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.technicalSpecs.headHeight.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Turbine Type
                  </label>
                  <input
                    {...register("technicalSpecs.turbineType")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                  {errors.technicalSpecs?.turbineType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.technicalSpecs.turbineType.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Annual Generation
                  </label>
                  <input
                    {...register("technicalSpecs.annualGeneration")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                  {errors.technicalSpecs?.annualGeneration && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.technicalSpecs.annualGeneration.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Grid Connection
                  </label>
                  <input
                    {...register("technicalSpecs.gridConnection")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                  {errors.technicalSpecs?.gridConnection && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.technicalSpecs.gridConnection.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">Timeline</h2>

              {timelineFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-4 items-start bg-gray-50 p-4 rounded"
                >
                  <div className="flex-1">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Year
                    </label>
                    <input
                      {...register(`timeline.${index}.year`)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                    {errors.timeline?.[index]?.year && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.timeline[index]?.year?.message}
                      </p>
                    )}
                  </div>

                  <div className="flex-1">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Milestone
                    </label>
                    <input
                      {...register(`timeline.${index}.milestone`)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                    {errors.timeline?.[index]?.milestone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.timeline[index]?.milestone?.message}
                      </p>
                    )}
                  </div>

                  {timelineFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTimeline(index)}
                      className="flex items-center justify-center py-2 px-5 text-white bg-red-600 rounded-md hover:bg-red-700 ease duration-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => appendTimeline({ year: "", milestone: "" })}
                className="flex items-center justify-center gap-2 rounded-md hover:bg-primary bg-primary/90 ease duration-300 py-2 px-5 text-white"
              >
                Add Timeline Entry
              </button>
              {errors.timeline && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.timeline.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-md hover:bg-primary bg-primary/90 ease duration-300 py-2 px-5 text-white"
              >
                Submit Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectForm;
