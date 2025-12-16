import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, Pencil, Trash2, X } from "lucide-react";
import { newsSchema, INews } from "@/lib/validations";
import { newsApi } from "@/lib/api";
import toast from "react-hot-toast";

interface NewsResponse extends Omit<INews, "file"> {
  _id: string;
  file: File;
  url: string;
}

export default function NewsTable() {
  const [viewModal, setViewModal] = useState<NewsResponse | null>(null);
  const [editModal, setEditModal] = useState<NewsResponse | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // News's data fetching
  const { data, isLoading, error } = useQuery({
    queryKey: ["news"],
    queryFn: newsApi.getAll,
  });

  useEffect(() => {
    if (data && data?.data) {
      toast.success(data?.data?.message);
    }
  }, [data]);

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<INews>({
    resolver: yupResolver(newsSchema),
  });

  const updateMutation = useMutation({
    mutationFn: newsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      setEditModal(null);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: newsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      setDeleteConfirm(null);
    },
  });

  const onSubmit = (updateValue: INews) => {
    sessionStorage.setItem("file", editModal._id);
    updateMutation.mutate(updateValue);
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error: {(error as Error).message}
      </div>
    );

  return (
    <>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data && data?.data?.all_news.length > 0 ? (
              data?.data?.all_news.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{item.title}</td>
                  <td className="px-6 py-4 text-sm">{item.category}</td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewModal(item)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setEditModal(item);
                          reset(item);
                        }}
                        className="text-green-600 hover:text-green-800 p-1"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(item._id)}
                        className="text-red-600 hover:text-red-800 p-1"
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
                  No news available
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
                  className="w-full h-64 object-cover rounded"
                />
              ) : (
                ""
              )}
              <div>
                <strong>Title:</strong> {viewModal.title}
              </div>
              <div>
                <strong>Category:</strong> {viewModal.category}
              </div>
              <div>
                <strong>Date:</strong>{" "}
                {new Date(viewModal.date).toLocaleDateString()}
              </div>
              <div>
                <strong>Excerpt:</strong> {viewModal.excerpt}
              </div>
              <div>
                <strong>Description:</strong>{" "}
                <p className="mt-2 text-gray-700">{viewModal.description}</p>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full my-8">
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
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">File</label>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setValue("file", file);
                    }
                  }}
                  accept=".png, .jpg, .jpeg"
                  className="w-full border rounded px-3 py-2"
                />
                {errors.file && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.file.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  {...register("title")}
                  className="w-full border rounded px-3 py-2"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Excerpt
                </label>
                <textarea
                  {...register("excerpt")}
                  rows={3}
                  className="w-full border rounded px-3 py-2"
                />
                {errors.excerpt && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.excerpt.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  {...register("date")}
                  className="w-full border rounded px-3 py-2"
                />
                {errors.date && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.date.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <input
                  {...register("category")}
                  className="w-full border rounded px-3 py-2"
                />
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="w-full border rounded px-3 py-2"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
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
                  disabled={updateMutation.isPending}
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
}
