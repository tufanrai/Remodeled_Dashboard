import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { FileUploadZone } from "@/components/upload/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  TechnicalSpecs,
  TechnicalSpecsData,
} from "@/components/projects/TechnicalSpecs";
import {
  ProjectTimeline,
  Milestone,
} from "@/components/projects/ProjectTimeline";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FolderOpen, Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  projectSchema,
  EStatus,
  type IProject,
  type ITechSpecs,
  type ITimeline,
} from "@/lib/validations";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const statusOptions = [
  { label: "Ongoing", value: EStatus.Ongoing },
  { label: "Planning", value: EStatus.Planning },
  { label: "Completed", value: EStatus.Completed },
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

interface Project {
  id: string;
  title: string;
  capacity: string;
  status: string;
  location: string;
  startYear: string;
  features: string;
  description: string;
  technicalSpecs: TechnicalSpecsData;
  milestones: Milestone[];
  images: string[];
  createdAt: string;
}

const mockProjects: Project[] = [
  {
    id: "1",
    title: "Upper Maulakalika Hydropower",
    capacity: "50 MW",
    status: "ongoing",
    location: "Dolakha, Nepal",
    startYear: "2022",
    features: "High efficiency turbines, Environmental friendly",
    description: "A major hydropower project in the region.",
    technicalSpecs: {
      projectType: "run-of-river",
      headHeight: "180",
      turbineType: "francis",
      annualGeneration: "220",
      gridConnection: "132kV line",
    },
    milestones: [{ id: "1", title: "Construction Started", year: "2022" }],
    images: ["/placeholder.svg"],
    createdAt: "2024-01-15",
  },
];

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<
    { url: string; title?: string }[]
  >([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Additional form state for complex nested data
  const [technicalSpecs, setTechnicalSpecs] = useState<TechnicalSpecsData>({
    projectType: "",
    headHeight: "",
    turbineType: "",
    annualGeneration: "",
    gridConnection: "",
  });
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IProject>({
    resolver: yupResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      capacity: "",
      status: undefined,
      location: "",
      startYear: "",
      features: [],
      fullDescription: "",
      file: "",
      technicalSpecs: {
        Type: "",
        headHeight: "",
        turbineType: "",
        annualGeneration: "",
        gridConnection: "",
      },
      timeline: [],
    },
  });

  const status = watch("status");
  const startYear = watch("startYear");

  const resetForm = () => {
    reset();
    setTechnicalSpecs({
      projectType: "",
      headHeight: "",
      turbineType: "",
      annualGeneration: "",
      gridConnection: "",
    });
    setMilestones([]);
    setIsEditing(null);
    setSelectedProject(null);
  };

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      const fileUrl = URL.createObjectURL(files[0]);
      setValue("file", fileUrl, { shouldValidate: true });
    }
  };

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
    // Prepare full data with technical specs and timeline
    const fullData = {
      ...data,
      technicalSpecs: convertSpecsToSchema(technicalSpecs),
      timeline: convertMilestonesToTimeline(milestones),
    };

    console.log("Project Form Data:", fullData);

    if (isEditing && selectedProject) {
      setProjects(
        projects.map((p) =>
          p.id === isEditing
            ? {
                ...p,
                title: data.title,
                capacity: data.capacity,
                status: data.status,
                location: data.location,
                startYear: data.startYear,
                features: Array.isArray(data.features)
                  ? data.features.join(", ")
                  : "",
                description: data.fullDescription,
                technicalSpecs,
                milestones,
                images: [data.file || p.images[0]],
              }
            : p
        )
      );
      toast.success("Project updated successfully");
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        title: data.title,
        capacity: data.capacity,
        status: data.status,
        location: data.location,
        startYear: data.startYear,
        features: Array.isArray(data.features) ? data.features.join(", ") : "",
        description: data.fullDescription,
        technicalSpecs,
        milestones,
        images: [data.file],
        createdAt: new Date().toISOString().split("T")[0],
      };
      setProjects([...projects, newProject]);
      toast.success("Project created successfully");
    }
    resetForm();
  };

  const handleEdit = (project: Project) => {
    setIsEditing(project.id);
    setSelectedProject(project);
    setValue("title", project.title);
    setValue("capacity", project.capacity);
    setValue("status", project.status as EStatus);
    setValue("location", project.location);
    setValue("startYear", project.startYear);
    setValue(
      "features",
      project.features.split(",").map((f) => f.trim())
    );
    setValue("description", project.description);
    setValue("fullDescription", project.description);
    setValue("file", project.images[0] || "");
    setTechnicalSpecs(project.technicalSpecs);
    setMilestones(project.milestones);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = () => {
    if (!selectedProject) return;
    setProjects(projects.filter((p) => p.id !== selectedProject.id));
    setShowDeleteDialog(false);
    setSelectedProject(null);
    toast.success("Project deleted successfully");
  };

  const openDeleteDialog = (project: Project) => {
    setSelectedProject(project);
    setShowDeleteDialog(true);
  };

  const openLightbox = (project: Project) => {
    setLightboxImages(
      project.images.map((url) => ({ url, title: project.title }))
    );
    setLightboxIndex(0);
    setLightboxOpen(true);
  };

  // Update technical specs in form when component changes
  const handleTechnicalSpecsChange = (specs: TechnicalSpecsData) => {
    setTechnicalSpecs(specs);
    setValue("technicalSpecs", convertSpecsToSchema(specs), {
      shouldValidate: true,
    });
  };

  // Update milestones in form when component changes
  const handleMilestonesChange = (newMilestones: Milestone[]) => {
    setMilestones(newMilestones);
    setValue("timeline", convertMilestonesToTimeline(newMilestones), {
      shouldValidate: true,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Upload and manage project details
          </p>
        </div>

        {/* Upload Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-xl bg-card p-6 shadow-card animate-slide-up space-y-6"
        >
          <h2 className="text-lg font-semibold">
            {isEditing ? "Edit Project" : "Add New Project"}
          </h2>

          <div className="space-y-2">
            <Label htmlFor="projectTitle">Project Title</Label>
            <Input
              id="projectTitle"
              placeholder="Enter project title"
              className={`bg-muted/30 ${
                errors.title ? "border-destructive" : ""
              }`}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                placeholder="e.g., 50 MW"
                className={`bg-muted/30 ${
                  errors.capacity ? "border-destructive" : ""
                }`}
                {...register("capacity")}
              />
              {errors.capacity && (
                <p className="text-sm text-destructive">
                  {errors.capacity.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
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
                <p className="text-sm text-destructive">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter project location"
                className={`bg-muted/30 ${
                  errors.location ? "border-destructive" : ""
                }`}
                {...register("location")}
              />
              {errors.location && (
                <p className="text-sm text-destructive">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startYear">Start Year</Label>
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
            <Label htmlFor="features">Features</Label>
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
              <p className="text-sm text-destructive">
                {errors.features.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullDescription">Full Description</Label>
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
                type="button"
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

        {/* Projects List */}
        <div className="rounded-xl bg-card shadow-card overflow-hidden animate-slide-up">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold">All Projects</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Title</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{project.capacity}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === "completed"
                          ? "bg-success/10 text-success"
                          : project.status === "ongoing"
                          ? "bg-info/10 text-info"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {project.status}
                    </span>
                  </TableCell>
                  <TableCell>{project.location}</TableCell>
                  <TableCell>{project.startYear}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openLightbox(project)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(project)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(project)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Project"
        description={`Are you sure you want to delete "${selectedProject?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        variant="destructive"
      />

      <ImageLightbox
        images={lightboxImages}
        currentIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />
    </DashboardLayout>
  );
};

export default Projects;
