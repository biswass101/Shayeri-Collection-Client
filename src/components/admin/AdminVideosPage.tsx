import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Plus, Search, Trash2, Upload, X } from "lucide-react";
import { useDeleteVideoMutation, useUpdateVideoMutation, useUploadVideoMutation } from "@/features/admin/adminApi";
import { useGetCategoriesQuery, useGetVideosQuery } from "@/features/home/homeApi";
import { useToast } from "@/components/ui/use-toast";
import type { Video } from "@/features/home/homeTypes";
import VideoGrid from "@/components/home/VideoGrid";
import VideoPlayerPage from "@/components/home/VideoPlayerPage";
import { useUI } from "@/components/layout/UIContext";

export default function AdminVideosPage() {
  const { addToast } = useToast();
  const { isAuthenticated } = useUI();
  const { data: categories } = useGetCategoriesQuery();
  const { data: videos, refetch, isLoading: isVideosLoading } = useGetVideosQuery();
  const [searchValue, setSearchValue] = useState("");
  const [uploadVideo, uploadState] = useUploadVideoMutation();
  const [updateVideo, updateState] = useUpdateVideoMutation();
  const [deleteVideo, deleteState] = useDeleteVideoMutation();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    categoryId: "",
    isPublished: true,
    videoFile: null as File | null,
    thumbnailFile: null as File | null,
  });
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Video | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  const filteredVideos = useMemo(() => {
    if (!videos) return [];
    const query = searchValue.trim().toLowerCase();
    if (!query) return videos;
    return videos.filter((video) =>
      `${video.title} ${video.subtitle ?? ""}`.toLowerCase().includes(query)
    );
  }, [videos, searchValue]);

  const resetForm = () => {
    setEditingId(null);
    setFormState({
      title: "",
      description: "",
      categoryId: "",
      isPublished: true,
      videoFile: null,
      thumbnailFile: null,
    });
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      setPortalTarget(document.body);
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-nowrap items-center justify-between gap-2">
        <div className="flex w-full min-w-0 max-w-xs items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 sm:px-4">
          <Search size={14} className="text-muted-foreground" />
          <Input
            placeholder="Search videos"
            className="h-7 w-full min-w-0 border-0 bg-transparent px-0 text-xs font-semibold text-foreground shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </div>

        <div className="flex flex-nowrap gap-2">
          <Button
            variant="secondary"
            className="h-10 w-10 rounded-full border border-border bg-background p-0 text-sm sm:w-auto sm:px-4"
            onClick={() => setShowForm((prev) => !prev)}
            aria-label="Add videos"
          >
            <Plus size={16} className="sm:mr-1" />
            <span className="hidden sm:inline">Add Videos</span>
          </Button>
        </div>
      </div>

      {showForm && portalTarget
        ? createPortal(
            <div className="fixed inset-0 z-50 grid min-h-[100dvh] w-screen place-items-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
              <Card className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm font-semibold">
                    {editingId ? "Edit Video" : "Add Video"}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                  >
                    <X size={16} />
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground">Title</label>
                    <Input
                      value={formState.title}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, title: event.target.value }))
                      }
                      placeholder="Video title"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground">Category</label>
                    <select
                      className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                      value={formState.categoryId}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, categoryId: event.target.value }))
                      }
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
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, description: event.target.value }))
                      }
                      placeholder="Video description"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Video File {editingId ? "(optional)" : ""}
                    </label>
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
                    <label className="text-xs font-semibold text-muted-foreground">
                      Thumbnail (optional)
                    </label>
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
                  <div className="md:col-span-2 flex flex-wrap gap-2">
                    <Button
                      className="gap-2"
                      disabled={uploadState.isLoading || updateState.isLoading}
                      onClick={async () => {
                        if (!formState.title || !formState.categoryId) {
                          addToast({
                            title: "Missing fields",
                            description: "Title and category are required.",
                            variant: "destructive",
                          });
                          return;
                        }

                        try {
                          if (editingId) {
                            await updateVideo({
                              id: editingId,
                              title: formState.title,
                              description: formState.description,
                              categoryId: formState.categoryId,
                              isPublished: formState.isPublished,
                              videoFile: formState.videoFile,
                              thumbnailFile: formState.thumbnailFile,
                            }).unwrap();

                            addToast({
                              title: "Update complete",
                              description: "Video was updated successfully.",
                            });
                          } else {
                            if (!formState.videoFile) {
                              addToast({
                                title: "Missing fields",
                                description: "Video file is required for new uploads.",
                                variant: "destructive",
                              });
                              return;
                            }

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
                          }

                          resetForm();
                          setShowForm(false);
                          refetch();
                        } catch (error) {
                          addToast({
                            title: editingId ? "Update failed" : "Upload failed",
                            description: "Please check the inputs and try again.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                  {editingId ? <Pencil size={16} /> : <Upload size={16} />}
                  {editingId ? "Save Changes" : "Upload Video"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>,
            portalTarget
          )
        : null}

      {confirmDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
          <Card className="w-full max-w-md rounded-2xl border border-border bg-card p-4 shadow-lg">
            <div className="mb-3 text-sm font-semibold">Delete video?</div>
            <p className="text-xs text-muted-foreground">
              Are you sure you want to delete “{confirmDelete.title}”? This action cannot be undone.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="gap-2 border-destructive text-destructive hover:bg-destructive/10"
                disabled={deleteState.isLoading}
                onClick={async () => {
                  try {
                    await deleteVideo(confirmDelete.id).unwrap();
                    if (selectedVideo?.id === confirmDelete.id) {
                      setSelectedVideo(null);
                    }
                    refetch();
                    addToast({
                      title: "Video deleted",
                      description: "The video was removed successfully.",
                    });
                  } catch (error) {
                    addToast({
                      title: "Delete failed",
                      description: "Please try again.",
                      variant: "destructive",
                    });
                  } finally {
                    setConfirmDelete(null);
                  }
                }}
              >
                Delete
              </Button>
              <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      ) : null}

      {selectedVideo ? (
        <div className="space-y-4">
          <Card className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{selectedVideo.title}</div>
                <div className="text-xs text-muted-foreground">{selectedVideo.subtitle}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  className="h-8 gap-2 rounded-full px-3 text-xs"
                  onClick={() => {
                    setEditingId(selectedVideo.id);
                    setFormState({
                      title: selectedVideo.title,
                      description: selectedVideo.description ?? "",
                      categoryId: selectedVideo.categoryId,
                      isPublished: selectedVideo.isPublished ?? true,
                      videoFile: null,
                      thumbnailFile: null,
                    });
                    setShowForm(true);
                  }}
                >
                  <Pencil size={14} />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  className="h-8 gap-2 rounded-full px-3 text-xs text-destructive hover:text-destructive"
                  disabled={deleteState.isLoading}
                  onClick={async () => {
                  setConfirmDelete(selectedVideo);
                  }}
                >
                  <Trash2 size={14} />
                  Delete
                </Button>
                <Button variant="ghost" className="h-8 gap-2 rounded-full px-3 text-xs" onClick={() => setSelectedVideo(null)}>
                  <X size={14} />
                  Back to List
                </Button>
              </div>
            </div>
          </Card>

          <VideoPlayerPage
            video={selectedVideo}
            isAuthenticated={isAuthenticated}
            onBack={() => setSelectedVideo(null)}
          />
        </div>
      ) : (
        <VideoGrid
          videos={filteredVideos}
          onSelect={(video) => setSelectedVideo(video)}
          isLoading={isVideosLoading}
        />
      )}
    </div>
  );
}
