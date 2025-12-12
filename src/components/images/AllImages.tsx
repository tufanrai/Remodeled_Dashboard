import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, Pencil, Trash2, X } from "lucide-react";
import { IImage, imageUpdateSchema } from "@/lib/validations";
import { imageApiDelete, imageApiGetAll, imageApiUpdate } from "@/lib/api";

interface ImageResponse extends Omit<IImage, "image"> {
  _id?: string;
  image?: File;
  url?: string;
}

export default function ImagesTable() {
  const [viewModal, setViewModal] = useState<ImageResponse | undefined>(
    undefined
  );
  const [editModal, setEditModal] = useState<ImageResponse | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["images"],
    queryFn: imageApiGetAll,
  });

  //   Updating the images
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(imageUpdateSchema),
  });

  //   mutation function
  const updateMutation = useMutation({
    mutationFn: imageApiUpdate,
    mutationKey: ["Update Imagedata"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
      setEditModal(null);
      reset();
    },
  });

  //   delete image
  const deleteMutation = useMutation({
    mutationFn: imageApiDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
      setDeleteConfirm(null);
    },
  });

  const updateImageData = (updatedData: IImage) => {
    sessionStorage.setItem("file", editModal._id);
    setTimeout(() => {
      updateMutation.mutate(updatedData);
    }, 1000);
    // console.log(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error: {(error as Error).message}
      </div>
    );
  }

  console.log(viewModal?.url);

  return (
    <>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Alt Text
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data && data?.files.length > 0 ? (
              data.files.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.alt}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewModal(item)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setEditModal(item);
                        }}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(item._id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No images available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">View Image</h3>
              <button onClick={() => setViewModal(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {viewModal && viewModal?.url ? (
                <img
                  src={viewModal.url}
                  alt={viewModal.alt}
                  className="w-full h-64 object-cover rounded"
                />
              ) : (
                ""
              )}
              <div>
                <strong>Category:</strong> {viewModal.category}
              </div>
              <div>
                <strong>Alt Text:</strong> {viewModal.alt}
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
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">Edit Image</h3>
              <button
                onClick={() => {
                  setEditModal(null);
                  reset();
                }}
              >
                <X size={24} />
              </button>
            </div>
            <form
              onSubmit={handleSubmit(updateImageData)}
              className="p-6 space-y-4"
            >
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Image
                </label>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setValue("image", file);
                    }
                  }}
                  accept=".png, .jpg, .jpeg"
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
                />
                {errors && errors.image ? (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.image.message}
                  </p>
                ) : (
                  ""
                )}
              </div>
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Category
                </label>
                <input
                  defaultValue={editModal.category}
                  {...register("category")}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
                />
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Alt Text
                </label>
                <input
                  defaultValue={editModal.alt}
                  {...register("alt")}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
                />
                {errors.alt && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.alt.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="reset"
                  onClick={() => {
                    setEditModal(null);
                    reset();
                  }}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {updateMutation.isPending ? "Updating..." : "Update"}
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
              Are you sure you want to delete this image?
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
}
