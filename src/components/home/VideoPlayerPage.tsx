import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Video, CommentItem } from "@/features/home/homeTypes";
import { ArrowLeft, Download, Heart, Send, Share2, Trash2, Pencil, Reply } from "lucide-react";
import {
  useIncrementVideoViewMutation,
  useLikeVideoMutation,
  useUnlikeVideoMutation,
  useGetLikeStatusQuery,
  useGetCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetVideosQuery,
  useShareVideoMutation,
  useDownloadVideoMutation,
  useGetShareTotalQuery,
  useGetDownloadTotalQuery,
} from "@/features/home/homeApi";
import { useUI } from "@/components/layout/UIContext";
import { useToast } from "@/components/ui/use-toast";

type VideoPlayerPageProps = {
  video: Video;
  isAuthenticated: boolean;
  onBack: () => void;
};

export default function VideoPlayerPage({ video, isAuthenticated, onBack }: VideoPlayerPageProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasCountedRef = useRef(false);
  const [incrementView] = useIncrementVideoViewMutation();
  const [likeVideo] = useLikeVideoMutation();
  const [unlikeVideo] = useUnlikeVideoMutation();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likesCount ?? 0);
  const [sharesCount, setSharesCount] = useState(video.sharesCount ?? 0);
  const [downloadsCount, setDownloadsCount] = useState(video.downloadsCount ?? 0);
  const [commentBody, setCommentBody] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState("");
  const { setAuthOpen, user } = useUI();
  const { addToast } = useToast();
  const { data: likeStatus } = useGetLikeStatusQuery(video.id, {
    skip: !isAuthenticated,
  });
  const { data: comments, refetch: refetchComments } = useGetCommentsQuery(video.id);
  const [addComment, addCommentState] = useAddCommentMutation();
  const [updateComment, updateCommentState] = useUpdateCommentMutation();
  const [deleteComment, deleteCommentState] = useDeleteCommentMutation();
  const { data: allVideos } = useGetVideosQuery();
  const [shareVideo, shareState] = useShareVideoMutation();
  const [downloadVideo, downloadState] = useDownloadVideoMutation();
  const { data: totalShares, refetch: refetchTotalShares } = useGetShareTotalQuery(video.id);
  const { data: totalDownloads, refetch: refetchTotalDownloads } = useGetDownloadTotalQuery(video.id);

  const persistDownload = () => {
    const entry = {
      id: video.id,
      title: video.title,
      subtitle: video.subtitle,
      thumbnailUrl: video.thumbnailUrl,
      downloadedAt: new Date().toISOString(),
    };
    try {
      const raw = localStorage.getItem("sayeri_downloads");
      const existing = raw ? JSON.parse(raw) : [];
      const filtered = Array.isArray(existing) ? existing.filter((item) => item.id !== video.id) : [];
      localStorage.setItem("sayeri_downloads", JSON.stringify([entry, ...filtered]));
    } catch {
      // Ignore storage errors
    }
  };

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    if (video.hlsUrl) {
      if (element.canPlayType("application/vnd.apple.mpegurl")) {
        element.src = video.hlsUrl;
        return;
      }

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(video.hlsUrl);
        hls.attachMedia(element);
        return () => {
          hls.destroy();
        };
      }
    }

    if (video.videoUrl) {
      element.src = video.videoUrl;
    }
  }, [video.hlsUrl, video.videoUrl]);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLiked(false);
      return;
    }
    if (likeStatus) {
      setIsLiked(likeStatus.liked);
    }
  }, [isAuthenticated, likeStatus]);

  useEffect(() => {
    setLikesCount(video.likesCount ?? 0);
  }, [video.likesCount]);

  useEffect(() => {
    setSharesCount(video.sharesCount ?? 0);
  }, [video.sharesCount]);

  useEffect(() => {
    setDownloadsCount(video.downloadsCount ?? 0);
  }, [video.downloadsCount]);

  const handleAddReply = async (parentId: string) => {
    if (!replyBody.trim()) return;
    try {
      await addComment({ id: video.id, body: replyBody, parentId }).unwrap();
      setReplyBody("");
      setReplyToId(null);
      refetchComments();
    } catch (error) {
      addToast({
        title: "Reply failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderComment = (comment: CommentItem, depth = 0) => {
    const isOwner = user?.id ? String(user.id) === comment.userId : false;
    const isEditing = editingCommentId === comment.id;

    return (
      <div
        key={comment.id}
        className={`rounded-lg border border-border bg-secondary p-3 ${
          depth > 0 ? "ml-6" : ""
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs font-semibold text-foreground">{comment.userName}</div>
          <div className="flex gap-2">
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => {
                if (!isAuthenticated) {
                  setAuthOpen(true);
                  addToast({
                    title: "Sign in required",
                    description: "Please sign in to reply.",
                  });
                  return;
                }
                setReplyToId(comment.id);
                setReplyBody("");
              }}
            >
              <Reply size={14} />
            </button>
            {isOwner ? (
              <>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setEditingCommentId(comment.id);
                    setEditingBody(comment.body);
                  }}
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground"
                  disabled={deleteCommentState.isLoading}
                  onClick={async () => {
                    try {
                      await deleteComment(comment.id).unwrap();
                      refetchComments();
                    } catch (error) {
                      addToast({
                        title: "Delete failed",
                        description: "Please try again.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </>
            ) : null}
          </div>
        </div>

        {isEditing ? (
          <form
            className="mt-2 space-y-2"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!editingBody.trim()) return;
              try {
                await updateComment({ id: comment.id, body: editingBody }).unwrap();
                setEditingCommentId(null);
                setEditingBody("");
                refetchComments();
              } catch (error) {
                addToast({
                  title: "Update failed",
                  description: "Please try again.",
                  variant: "destructive",
                });
              }
            }}
          >
            <textarea
              className="min-h-[70px] w-full resize-none rounded-lg border border-border bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={editingBody}
              onChange={(event) => setEditingBody(event.target.value)}
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={updateCommentState.isLoading}>
                Save
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingCommentId(null);
                  setEditingBody("");
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-2 text-xs text-muted-foreground">{comment.body}</div>
        )}

        {replyToId === comment.id ? (
          <form
            className="mt-2 space-y-2"
            onSubmit={(event) => {
              event.preventDefault();
              handleAddReply(comment.id);
            }}
          >
            <textarea
              className="min-h-[60px] w-full resize-none rounded-lg border border-border bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Write a reply..."
              value={replyBody}
              onChange={(event) => setReplyBody(event.target.value)}
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={addCommentState.isLoading}>
                Reply
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setReplyToId(null);
                  setReplyBody("");
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : null}

        {comment.replies && comment.replies.length > 0 ? (
          <div className="mt-3 space-y-3">
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={onBack}
          aria-label="Back to Home"
        >
          <ArrowLeft size={16} className="sm:mr-1" />
          <span className="hidden sm:inline">Back to Home</span>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-black">
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-contain"
                poster={video.thumbnailUrl}
                controls
                playsInline
                onPlay={() => {
                  if (hasCountedRef.current) return;
                  hasCountedRef.current = true;
                  incrementView(video.id);
                }}
              />
              {!video.hlsUrl && !video.videoUrl ? (
                <div className="absolute text-sm text-muted-foreground">Streaming unavailable</div>
              ) : null}
            </div>
          </Card>

          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">{video.title}</h2>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{video.views}</span>
                <span>•</span>
                <span>{video.uploaded}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={isLiked ? "default" : "secondary"}
                size="sm"
                className="gap-2"
                onClick={async () => {
                  if (!isAuthenticated) {
                    setAuthOpen(true);
                    addToast({
                      title: "Sign in required",
                      description: "Please sign in to like this video.",
                    });
                    return;
                  }

                  try {
                    if (isLiked) {
                      await unlikeVideo(video.id).unwrap();
                      setIsLiked(false);
                      setLikesCount((prev) => Math.max(0, prev - 1));
                    } else {
                      await likeVideo(video.id).unwrap();
                      setIsLiked(true);
                      setLikesCount((prev) => prev + 1);
                    }
                  } catch (error) {
                    addToast({
                      title: "Like failed",
                      description: "Please try again.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <Heart size={16} className={isLiked ? "fill-current" : ""} /> Like
                <span className="text-xs text-muted-foreground">{likesCount}</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="gap-2"
                disabled={downloadState.isLoading}
                onClick={async () => {
                  if (!isAuthenticated) {
                    setAuthOpen(true);
                    addToast({
                      title: "Sign in required",
                      description: "Please sign in to download.",
                    });
                    return;
                  }

                  try {
                    const response = await downloadVideo(video.id).unwrap();
                    const downloadUrl = response?.data?.downloadUrl;
                    if (!downloadUrl) {
                      throw new Error("Missing download URL");
                    }
                    const safeTitle = (video.title || "sayeri-video")
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-+|-+$/g, "")
                      .slice(0, 60);
                    const link = document.createElement("a");
                    link.href = downloadUrl;
                    link.download = `${safeTitle || "sayeri-video"}.mp4`;
                    link.rel = "noopener noreferrer";
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    persistDownload();
                    setDownloadsCount((prev) => prev + 1);
                    refetchTotalDownloads();
                    addToast({
                      title: "Download started",
                      description: "Your download is being prepared.",
                    });
                  } catch (error) {
                    addToast({
                      title: "Download failed",
                      description: "Please try again.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <Download size={16} /> Download
                <span className="text-xs text-muted-foreground">
                  {typeof totalDownloads === "number" ? totalDownloads : downloadsCount}
                </span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="gap-2"
                disabled={shareState.isLoading}
                onClick={async () => {
                  if (!isAuthenticated) {
                    setAuthOpen(true);
                    addToast({
                      title: "Sign in required",
                      description: "Please sign in to share.",
                    });
                    return;
                  }

                  const shareUrl = `${window.location.origin}/watch/${video.id}`;
                  const useNative = typeof navigator !== "undefined" && "share" in navigator;
                  const channel = useNative ? "native" : "copy_link";

                  try {
                    await shareVideo({ id: video.id, channel }).unwrap();
                    setSharesCount((prev) => prev + 1);
                    refetchTotalShares();
                    if (useNative) {
                      await (navigator as Navigator).share({
                        title: video.title,
                        text: video.subtitle,
                        url: shareUrl,
                      });
                      addToast({
                        title: "Shared",
                        description: "Thanks for sharing!",
                      });
                    } else if (navigator.clipboard?.writeText) {
                      await navigator.clipboard.writeText(shareUrl);
                      addToast({
                        title: "Link copied",
                        description: "Share link copied to clipboard.",
                      });
                    } else {
                      addToast({
                        title: "Share ready",
                        description: shareUrl,
                      });
                    }
                  } catch (error) {
                    addToast({
                      title: "Share failed",
                      description: "Please try again.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <Share2 size={16} /> Share
                <span className="text-xs text-muted-foreground">
                  {typeof totalShares === "number" ? totalShares : sharesCount}
                </span>
              </Button>
            </div>
          </div>
        </div>

        <Card className="h-full">
          <div className="flex h-full flex-col gap-4 p-4">
            <h3 className="text-base font-semibold">
              Comments
              <span className="ml-2 text-xs text-muted-foreground">
                {comments ? comments.length : 0}
              </span>
            </h3>
            {isAuthenticated ? (
              <form
                className="flex flex-col gap-2"
                onSubmit={async (event) => {
                  event.preventDefault();
                  if (!commentBody.trim()) return;
                  try {
                    await addComment({ id: video.id, body: commentBody }).unwrap();
                    setCommentBody("");
                    refetchComments();
                  } catch (error) {
                    addToast({
                      title: "Comment failed",
                      description: "Please try again.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <textarea
                  className="min-h-[80px] w-full resize-none rounded-lg border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Write a comment..."
                  value={commentBody}
                  onChange={(event) => setCommentBody(event.target.value)}
                />
                <Button type="submit" size="sm" className="w-full gap-2" disabled={addCommentState.isLoading}>
                  <Send size={14} /> Post Comment
                </Button>
              </form>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                Sign in to view and add comments.
              </div>
            )}

            <div className="flex flex-col gap-3 text-sm">
              {(comments ?? []).map((comment) => renderComment(comment))}
              {comments && comments.length === 0 ? (
                <div className="rounded-lg border border-border p-3 text-xs text-muted-foreground">
                  No comments yet.
                </div>
              ) : null}
            </div>
          </div>
        </Card>
      </div>

      <div className="rounded-2xl border border-border bg-card p-3 sm:p-4">
        <div className="text-sm font-semibold">More Videos</div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {(allVideos ?? [])
            .filter((item) => item.id !== video.id)
            .slice(0, 5)
            .map((item) => (
              <button
                key={item.id}
                type="button"
                className="rounded-xl border border-border bg-background p-3 text-left transition hover:bg-muted/40"
                onClick={() => window.location.assign(`/watch/${item.id}`)}
              >
                <div className="h-20 w-full overflow-hidden rounded-lg bg-muted">
                  {item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                </div>
                <div className="mt-3 text-sm font-semibold truncate">{item.title}</div>
                <div className="mt-1 text-xs text-muted-foreground truncate">
                  {item.views} • {item.uploaded}
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
