import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Upload } from "lucide-react";
import { useUploadVideoMutation } from "@/features/admin/adminApi";
import { useGetCategoriesQuery, useGetVideosQuery } from "@/features/home/homeApi";
import { useToast } from "@/components/ui/use-toast";

export default function AdminVideosPage() {
  const { addToast } = useToast();
  const { data: categories } = useGetCategoriesQuery();
  const { data: videos } = useGetVideosQuery();
  const [uploadVideo, uploadState] = useUploadVideoMutation();
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    categoryId: "",
    isPublished: true,
    videoFile: null as File | null,
    thumbnailFile: null as File | null,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full max-w-xs rounded-full border border-border bg-card px-4 py-1.5">
          <Input
            placeholder="Search videos"
            className="h-7 border-0 bg-transparent px-0 text-xs font-semibold text-foreground shadow-none focus-visible:ring-0"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="h-10 rounded-full border border-border bg-background px-4 text-sm"
            onClick={() => setShowForm((prev) => !prev)}
          >
            <Plus size={16} className="mr-1" />
            Add Videos
          </Button>
        </div>
      </div>

      {showForm ? (
        <Card className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">Title</label>
              <Input
                value={formState.title}
                onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Video title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">Category</label>
              <select
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                value={formState.categoryId}
                onChange={(event) => setFormState((prev) => ({ ...prev, categoryId: event.target.value }))}
              >
                <option value="">Select category</option>
                {(categories ?? []).map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">Description</label>
              <textarea
                className="min-h-[90px] w-full resize-none rounded-md border border-border bg-background p-3 text-sm"
                value={formState.description}
                onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Video description"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">Video File</label>
              <Input
                type="file"
                accept="video/*"
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    videoFile: event.target.files?.[0] ?? null,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">Thumbnail (optional)</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    thumbnailFile: event.target.files?.[0] ?? null,
                  }))
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="isPublished"
                type="checkbox"
                checked={formState.isPublished}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, isPublished: event.target.checked }))
                }
              />
              <label htmlFor="isPublished" className="text-xs text-muted-foreground">
                Published
              </label>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button
                className="gap-2"
                disabled={uploadState.isLoading}
                onClick={async () => {
                  if (!formState.title || !formState.categoryId || !formState.videoFile) {
                    addToast({
                      title: "Missing fields",
                      description: "Title, category, and video file are required.",
                      variant: "destructive",
                    });
                    return;
                  }

                  try {
                    await uploadVideo({
                      title: formState.title,
                      description: formState.description,
                      categoryId: formState.categoryId,
                      isPublished: formState.isPublished,
                      videoFile: formState.videoFile,
                      thumbnailFile: formState.thumbnailFile,
                    }).unwrap();

                    addToast({
                      title: "Upload complete",
                      description: "Video was uploaded successfully.",
                    });

                    setFormState({
                      title: "",
                      description: "",
                      categoryId: "",
                      isPublished: true,
                      videoFile: null,
                      thumbnailFile: null,
                    });
                  } catch (error) {
                    addToast({
                      title: "Upload failed",
                      description: "Please check the inputs and try again.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <Upload size={16} />
                Upload Video
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {(videos ?? []).slice(0, 8).map((item) => (
          <Card key={item.id} className="rounded-2xl border border-border bg-card p-3 shadow-sm">
            <div className="mb-3 h-24 overflow-hidden rounded-xl bg-muted">
              {item.thumbnailUrl ? (
                <img src={item.thumbnailUrl} alt={item.title} className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="space-y-2">
              <div className="text-sm font-semibold truncate">{item.title}</div>
              <div className="text-xs text-muted-foreground truncate">{item.subtitle}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
