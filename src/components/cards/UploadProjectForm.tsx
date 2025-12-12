import {
  EStatus,
  IProject,
  ITechSpecs,
  ITimeline,
  projectSchema,
} from "@/lib/validations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import React from "react";
import { FileUploadZone } from "../upload/FileUploadZone";
import { Button } from "react-day-picker";
import { FolderOpen } from "lucide-react";
import { TechnicalSpecs, TechnicalSpecsData } from "../projects/TechnicalSpecs";
import { Milestone, ProjectTimeline } from "../projects/ProjectTimeline";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// static vars
const statusOptions = [
  { label: "Ongoing", value: EStatus.Ongoing },
  { label: "Planning", value: EStatus.Planning },
  { label: "Completed", value: EStatus.Completed },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

const UploadProjectForm = () => {
  // Inputs validation
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IProject>({
    resolver: yupResolver(projectSchema),
  });

  //   data utils
  const status = watch("status");
  const startYear = watch("startYear");

  const convertSpecsToSchema = (specs: TechnicalSpecsData): ITechSpecs => ({
    Type: specs.projectType,
    headHeight: specs.headHeight,
    turbineType: specs.turbineType,
    annualGeneration: specs.annualGeneration,
    gridConnection: specs.gridConnection,
  });

  const convertMilestonesToTimeline = (milestones: Milestone[]): ITimeline[] =>
    milestones.map((m) => ({ year: m.year, milestone: m.title }));

  const onSubmit = (data: IProject) => {
    console.log(data);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl bg-card p-6 shadow-card animate-slide-up space-y-6"
    >
      <h2 className="text-lg font-semibold">Add New Project</h2>

      <div className="space-y-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="projectTitle"
        >
          Project Title
        </label>
        <input
          id="projectTitle"
          placeholder="Enter project title"
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="capacity"
          >
            Capacity
          </label>
          <input
            id="capacity"
            placeholder="e.g., 50 MW"
            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
            {...register("capacity")}
          />
          {errors.capacity && (
            <p className="text-sm text-destructive">
              {errors.capacity.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="status"
          >
            Status
          </label>
          <Select
            value={status}
            onValueChange={(value) =>
              setValue("status", value as EStatus, { shouldValidate: true })
            }
          >
            <SelectTrigger
              className={`bg-muted/30 ${
                errors.status ? "border-destructive" : ""
              }`}
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-card border shadow-lg">
              {statusOptions.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-destructive">{errors.status.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="location"
          >
            Location
          </label>
          <input
            id="location"
            placeholder="Enter project location"
            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
            {...register("location")}
          />
          {errors.location && (
            <p className="text-sm text-destructive">
              {errors.location.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="startYear"
          >
            Start Year
          </label>
          <Select
            value={startYear}
            onValueChange={(value) =>
              setValue("startYear", value, { shouldValidate: true })
            }
          >
            <SelectTrigger
              className={`bg-muted/30 ${
                errors.startYear ? "border-destructive" : ""
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
          {errors.startYear && (
            <p className="text-sm text-destructive">
              {errors.startYear.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="features"
        >
          Features
        </label>
        <Textarea
          id="features"
          placeholder="Enter project features (comma separated)"
          className={`bg-muted/30 min-h-[80px] ${
            errors.features ? "border-destructive" : ""
          }`}
          {...register("description")}
          onChange={(e) => {
            setValue(
              "features",
              e.target.value
                .split(",")
                .map((f) => f.trim())
                .filter(Boolean),
              { shouldValidate: true }
            );
            setValue("description", e.target.value, {
              shouldValidate: true,
            });
          }}
        />
        {errors.features && (
          <p className="text-sm text-destructive">{errors.features.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="fullDescription"
        >
          Full Description
        </label>
        <Textarea
          id="fullDescription"
          placeholder="Enter detailed project description"
          className={`bg-muted/30 min-h-[120px] ${
            errors.fullDescription ? "border-destructive" : ""
          }`}
          {...register("fullDescription")}
        />
        {errors.fullDescription && (
          <p className="text-sm text-destructive">
            {errors.fullDescription.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <TechnicalSpecs
          specs={technicalSpecs}
          onChange={handleTechnicalSpecsChange}
        />
        {errors.technicalSpecs && (
          <p className="text-sm text-destructive">
            Please fill all technical specs
          </p>
        )}
      </div>

      <div className="space-y-2">
        <ProjectTimeline
          milestones={milestones}
          onChange={handleMilestonesChange}
        />
        {errors.timeline && (
          <p className="text-sm text-destructive">
            At least one timeline entry is required
          </p>
        )}
      </div>

      <div className="space-y-2">
        <FileUploadZone
          accept="image/*,.glb,.fbx,.obj"
          multiple
          maxFiles={10}
          label="Upload Project Files & Images"
          onFilesSelected={handleFileSelect}
        />
        {errors.file && (
          <p className="text-sm text-destructive">{errors.file.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        {isEditing && (
          <Button
            type="reset"
            variant="outline"
            onClick={resetForm}
            disabled={isSubmitting}
          >
            Cancel Edit
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          <FolderOpen className="mr-2 h-4 w-4" />
          {isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Project"
            : "Save Project"}
        </Button>
      </div>
    </form>
  );
};

export default UploadProjectForm;
