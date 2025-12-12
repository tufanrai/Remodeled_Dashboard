import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { FileUploadZone } from "@/components/upload/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Newspaper, Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { newsSchema, type INews } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const newsCategories = [
  "Company Update",
  "Industry News",
  "Project Milestone",
  "Event",
  "Announcement",
];

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  date: string;
  category: string;
  image: string;
  createdAt: string;
}

const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "New Turbine Installation Complete",
    excerpt:
      "We have successfully completed the installation of our new high-efficiency turbines.",
    description:
      "The installation marks a major milestone in our project development.",
    date: "2024-03-15",
    category: "project-milestone",
    image: "/placeholder.svg",
    createdAt: "2024-03-15",
  },
];

const News = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(mockNews);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<
    { url: string; title?: string }[]
  >([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<INews>({
    resolver: yupResolver(newsSchema),
    defaultValues: {
      file: "",
      title: "",
      excerpt: "",
      date: "",
      category: "",
      description: "",
    },
  });

  const category = watch("category");
  const date = watch("date");

  const resetForm = () => {
    reset();
    setIsEditing(null);
    setSelectedNews(null);
  };

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      const fileUrl = URL.createObjectURL(files[0]);
      setValue("file", fileUrl, { shouldValidate: true });
    }
  };

  const onSubmit = (data: INews) => {
    console.log("News Form Data:", data);

    if (isEditing && selectedNews) {
      setNewsItems(
        newsItems.map((n) =>
          n.id === isEditing
            ? {
                ...n,
                title: data.title,
                excerpt: data.excerpt,
                description: data.description,
                date: data.date,
                category: data.category,
                image: data.file || n.image,
              }
            : n
        )
      );
      toast.success("News updated successfully");
    } else {
      const newNews: NewsItem = {
        id: Date.now().toString(),
        title: data.title,
        excerpt: data.excerpt,
        description: data.description,
        date: data.date,
        category: data.category,
        image: data.file,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setNewsItems([...newsItems, newNews]);
      toast.success("News published successfully");
    }
    resetForm();
  };

  const handleEdit = (news: NewsItem) => {
    setIsEditing(news.id);
    setSelectedNews(news);
    setValue("title", news.title);
    setValue("excerpt", news.excerpt);
    setValue("description", news.description);
    setValue("date", news.date);
    setValue("category", news.category);
    setValue("file", news.image);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = () => {
    if (!selectedNews) return;
    setNewsItems(newsItems.filter((n) => n.id !== selectedNews.id));
    setShowDeleteDialog(false);
    setSelectedNews(null);
    toast.success("News deleted successfully");
  };

  const openDeleteDialog = (news: NewsItem) => {
    setSelectedNews(news);
    setShowDeleteDialog(true);
  };

  const openLightbox = (news: NewsItem) => {
    setLightboxImages([{ url: news.image, title: news.title }]);
    setLightboxIndex(0);
    setLightboxOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold tracking-tight">News</h1>
          <p className="text-muted-foreground">
            Upload and manage company news
          </p>
        </div>

        {/* Upload Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-xl bg-card p-6 shadow-card animate-slide-up space-y-6"
        >
          <h2 className="text-lg font-semibold">
            {isEditing ? "Edit News" : "Post New News"}
          </h2>

          <div className="space-y-2">
            <Label htmlFor="newsTitle">Title</Label>
            <Input
              id="newsTitle"
              placeholder="Enter news title"
              className={`bg-muted/30 ${
                errors.title ? "border-destructive" : ""
              }`}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              placeholder="Enter a brief summary of the news"
              className={`bg-muted/30 min-h-[80px] ${
                errors.excerpt ? "border-destructive" : ""
              }`}
              {...register("excerpt")}
            />
            {errors.excerpt && (
              <p className="text-sm text-destructive">
                {errors.excerpt.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter full news description"
              className={`bg-muted/30 min-h-[120px] ${
                errors.description ? "border-destructive" : ""
              }`}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                className={`bg-muted/30 ${
                  errors.date ? "border-destructive" : ""
                }`}
                {...register("date")}
              />
              {errors.date && (
                <p className="text-sm text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={(value) =>
                  setValue("category", value, { shouldValidate: true })
                }
              >
                <SelectTrigger
                  className={`bg-muted/30 ${
                    errors.category ? "border-destructive" : ""
                  }`}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-card border shadow-lg">
                  {newsCategories.map((cat) => (
                    <SelectItem
                      key={cat}
                      value={cat.toLowerCase().replace(/\s+/g, "-")}
                    >
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <FileUploadZone
              accept="image/*"
              multiple={false}
              maxFiles={1}
              label="Upload News Image"
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
              <Newspaper className="mr-2 h-4 w-4" />
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update News"
                : "Publish News"}
            </Button>
          </div>
        </form>

        {/* News List */}
        <div className="rounded-xl bg-card shadow-card overflow-hidden animate-slide-up">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold">All News</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newsItems.map((news) => (
                <TableRow key={news.id}>
                  <TableCell className="font-medium">{news.title}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {news.category.replace(/-/g, " ")}
                    </span>
                  </TableCell>
                  <TableCell>{news.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openLightbox(news)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(news)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(news)}
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
        title="Delete News"
        description={`Are you sure you want to delete "${selectedNews?.title}"? This action cannot be undone.`}
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

export default News;
