// components/ProjectsTable.tsx

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  EStatus,
  IProject,
  IUpdateProject,
  projectSchema,
  updateProjectSchema,
} from "@/lib/validations";
import { projectApi } from "@/lib/api";
import { Eye, Pencil, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Textarea } from "../ui/textarea";
import toast from "react-hot-toast";

interface ProjectsResponse extends Omit<IUpdateProject, "files"> {
  _id: string;
  file: File;
  title: string;
  capacity: string;
  startYear: string;
  url: string;
}

const ProjectsTable = () => {
  const [viewModal, setViewModal] = useState<ProjectsResponse | null>(null);
  const [editModal, setEditModal] = useState<ProjectsResponse | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // React Query cache manager
  const queryClient = useQueryClient();

  /**
   * Fetch projects list
   */
  const { data, isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: projectApi.getAll,
  });

  useEffect(() => {
    if (data && data.data) {
      toast.success(data?.data?.message);
    }
  }, [data]);

  // Mutation for updating a project
  const updateMutation = useMutation({
    mutationFn: projectApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setEditModal(null);
      reset();
    },
  });

  // Mutation for deleting a project
  const deleteMutation = useMutation({
    mutationFn: projectApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setDeleteConfirm(null);
    },
  });

  // React Hook Form setup
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IUpdateProject>({
    resolver: yupResolver(updateProjectSchema),
    defaultValues: {
      features: editModal?.features,
      timeline: editModal?.timeline,
      technicalSpecs: {},
    },
  });

  // Handle form submission for updating a project
  const onsubmit = (updateValue: IUpdateProject) => {
    sessionStorage.setItem("file", editModal?._id);
    updateMutation.mutate(updateValue);
  };

  // Loading UI
  if (isLoading) {
    return <p className="text-center mt-10">Loading projects...</p>;
  }

  // Error UI
  if (isError) {
    return (
      <p className="text-center mt-10 text-red-500">Failed to load projects.</p>
    );
  }

  return (
    <>
      {/* Responsive table wrapper */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          {/* Table header */}
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Start Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table body */}
          <tbody className="divide-y divide-gray-200">
            {data?.data?.files.map((project) => (
              <tr key={project._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{project.title}</td>

                {/* Status badge */}
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 text-xs rounded font-medium
                      ${
                        project.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : project.status === "Ongoing"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {project.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm">{project.capacity}</td>
                <td className="px-6 py-4 text-sm">{project.location}</td>
                <td className="px-6 py-4 text-sm">{project.startYear}</td>

                {/* Actions */}
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setViewModal(project)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditModal(project)}
                      className="text-green-600 hover:text-green-800 p-1"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(project._id)}
                      disabled={deleteMutation.isPending}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {/* Empty state */}
            {data?.data?.files.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">View News</h3>
              <button onClick={() => setViewModal(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {viewModal && viewModal?.url ? (
                <img
                  src={viewModal.url}
                  alt={viewModal.title}
                  className="w-full h-64 object-cover rounded"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                  No image available
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Title:</strong>
                  <div className="mt-1">{viewModal.title}</div>
                </div>

                <div>
                  <strong>Status:</strong>
                  <div className="mt-1">
                    <span
                      className={`px-2 py-1 text-xs rounded font-medium
                      ${
                        viewModal.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : viewModal.status === "Ongoing"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {viewModal.status}
                    </span>
                  </div>
                </div>

                <div>
                  <strong>Capacity:</strong>
                  <div className="mt-1">{viewModal.capacity}</div>
                </div>

                <div>
                  <strong>Location:</strong>
                  <div className="mt-1">{viewModal.location}</div>
                </div>

                <div>
                  <strong>Start Year:</strong>
                  <div className="mt-1">
                    {viewModal.startYear
                      ? new Date(viewModal.startYear).toLocaleDateString()
                      : "-"}
                  </div>
                </div>
              </div>

              <div>
                <strong>Features:</strong>
                <div className="mt-1 text-gray-700 flex flex-wrap gap-2">
                  {/* @ts-ignore */}
                  {viewModal?.features?.split(",").map((feature, index) => (
                    <span
                      key={index}
                      className="px-5 py-2 rounded-full bg-slate-200 font-regural text-xs flex items-center justify-center"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <strong>Short Description:</strong>
                <p className="mt-2 text-gray-700">{viewModal.description}</p>
              </div>

              {viewModal.fullDescription && (
                <div>
                  <strong>Full Description:</strong>
                  <p className="mt-2 text-gray-700">
                    {viewModal.fullDescription}
                  </p>
                </div>
              )}

              {/* Technical Specs */}
              <div>
                <strong>Technical Specifications:</strong>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {viewModal.technicalSpecs ? (
                    <>
                      <div className="text-sm text-gray-700">
                        <span className="font-medium mr-2">Type:</span>
                        <span>{viewModal.technicalSpecs[0].Type}</span>
                      </div>
                      <div className="text-sm text-gray-700">
                        <span className="font-medium mr-2">Head height:</span>
                        <span>{viewModal.technicalSpecs[0].headHeight}</span>
                      </div>
                      <div className="text-sm text-gray-700">
                        <span className="font-medium mr-2">Turbine type:</span>
                        <span>{viewModal.technicalSpecs[0].turbineType}</span>
                      </div>
                      <div className="text-sm text-gray-700">
                        <span className="font-medium mr-2">
                          Annual generation:
                        </span>
                        <span>
                          {viewModal.technicalSpecs[0].annualGeneration}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700">
                        <span className="font-medium mr-2">
                          Grid connection:
                        </span>
                        <span>
                          {viewModal.technicalSpecs[0].gridConnection}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-500">
                      No technical specifications available.
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <strong>Timeline:</strong>
                <div className="mt-2 space-y-2">
                  {(viewModal.timeline || "").length > 0 ? (
                    (viewModal.timeline || "")
                      .split(",")
                      .map((history, idx) => (
                        <div key={idx} className="text-sm text-gray-700">
                          <span className="font-medium">
                            {history.split(":")[0]}
                          </span>
                          <span className="mx-2">—</span>
                          <span>{history.split(":")[1]}</span>
                        </div>
                      ))
                  ) : (
                    <div className="text-sm text-gray-500">
                      No timeline entries.
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end p-6 border-t">
              <button
                onClick={() => setViewModal(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl max-h-xl h-screen overflow-y-auto w-full my-8">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">Edit News</h3>
              <button
                onClick={() => {
                  setEditModal(null);
                  reset();
                }}
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onsubmit)} className="p-6 space-y-4">
              {/* Title update */}
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Title
                </label>
                <input
                  defaultValue={editModal.title}
                  {...register("title")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description update */}
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Description
                </label>
                <Textarea
                  defaultValue={editModal.description}
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

              {/* Capacity update */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Capacity
                  </label>
                  <input
                    defaultValue={editModal.capacity}
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
                    defaultValue={editModal.status}
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

              {/* Location update */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Location
                  </label>
                  <input
                    defaultValue={editModal.location}
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
                    defaultValue={editModal.startYear}
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

              {/* Full description update */}
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Full Description
                </label>
                <Textarea
                  {...register("fullDescription")}
                  rows={5}
                  defaultValue={editModal.fullDescription}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.fullDescription && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullDescription.message}
                  </p>
                )}
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700">
                  Features
                </h2>

                <div className="flex gap-2">
                  <input
                    placeholder="Add a feature"
                    {...register("features")}
                    defaultValue={editModal?.features}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
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
                  {/* Type update */}
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Type
                    </label>
                    <input
                      defaultValue={editModal.technicalSpecs[0].Type}
                      {...register("technicalSpecs.Type")}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                    {errors.technicalSpecs?.Type && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.technicalSpecs.Type.message}
                      </p>
                    )}
                  </div>
                  {/* head Height update */}
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Head Height
                    </label>
                    <input
                      defaultValue={editModal.technicalSpecs[0].headHeight}
                      {...register("technicalSpecs.headHeight")}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                    {errors.technicalSpecs?.headHeight && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.technicalSpecs.headHeight.message}
                      </p>
                    )}
                  </div>
                  {/* Turbine type update */}
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Turbine Type
                    </label>
                    <input
                      defaultValue={editModal.technicalSpecs[0].turbineType}
                      {...register("technicalSpecs.turbineType")}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                    {errors.technicalSpecs?.turbineType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.technicalSpecs.turbineType.message}
                      </p>
                    )}
                  </div>

                  {/* annual generation update */}
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Annual Generation
                    </label>
                    <input
                      defaultValue={
                        editModal.technicalSpecs[0].annualGeneration
                      }
                      {...register("technicalSpecs.annualGeneration")}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                    {errors.technicalSpecs?.annualGeneration && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.technicalSpecs.annualGeneration.message}
                      </p>
                    )}
                  </div>
                  {/* Grid connection update */}
                  <div className="col-span-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Grid Connection
                    </label>
                    <input
                      defaultValue={editModal.technicalSpecs[0].gridConnection}
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
                <h2 className="text-xl font-semibold text-gray-700">
                  Timeline
                </h2>

                <Textarea
                  cols={3}
                  defaultValue={editModal?.timeline}
                  {...register("timeline")}
                  placeholder="Please mention the milestones achived if have any... (Year: milestone,...)"
                />
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
      )}

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this news article?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirm)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectsTable;
