import { useNavigate } from "react-router-dom";
import VideoGrid from "@/components/home/VideoGrid";
import { Card } from "@/components/ui/card";
import { useGetLikedVideosQuery } from "@/features/home/homeApi";

export default function LikedVideosPage() {
  const navigate = useNavigate();
  const { data: likedVideos = [], isLoading } = useGetLikedVideosQuery();

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Liked Videos</h2>
          <p className="text-sm text-muted-foreground">Videos you have liked.</p>
        </div>
        <div className="text-xs text-muted-foreground">{likedVideos.length} items</div>
      </div>

      {!isLoading && likedVideos.length === 0 ? (
        <Card className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">No liked videos yet.</p>
        </Card>
      ) : (
        <VideoGrid
          videos={likedVideos}
          onSelect={(video) => navigate(`/watch/${video.id}`)}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
