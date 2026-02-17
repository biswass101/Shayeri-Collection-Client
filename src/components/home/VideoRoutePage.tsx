import { useNavigate, useParams } from "react-router-dom";
import { useGetVideoByIdQuery } from "@/features/home/homeApi";
import VideoPlayerPage from "@/components/home/VideoPlayerPage";
import { useUI } from "@/components/layout/UIContext";

export default function VideoRoutePage() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useUI();
  const { data: video, isLoading, isFetching } = useGetVideoByIdQuery(videoId ?? "", {
    skip: !videoId,
  });

  if (isLoading || isFetching) {
    return <VideoPlayerSkeleton />;
  }

  if (!video) {
    return (
      <div className="mt-10 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Video not found. Please go back.
      </div>
    );
  }

  return (
    <VideoPlayerPage
      video={video}
      isAuthenticated={isAuthenticated}
      onBack={() => navigate("/")}
    />
  );
}

function VideoPlayerSkeleton() {
  return (
    <div className="video-player-skeleton mt-6 space-y-6" aria-busy="true">
      <div className="video-player-back skeleton" />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <div className="video-player-hero skeleton" />

          <div className="video-player-meta-card">
            <div className="video-player-title skeleton" />
            <div className="video-player-subtitle skeleton" />
            <div className="video-player-actions">
              <div className="video-player-action skeleton" />
              <div className="video-player-action skeleton" />
              <div className="video-player-action skeleton" />
            </div>
          </div>
        </div>

        <div className="video-player-comments">
          <div className="video-player-comments-title skeleton" />
          <div className="video-player-comment skeleton" />
          <div className="video-player-comment skeleton" />
          <div className="video-player-comment skeleton" />
        </div>
      </div>

      <div className="video-player-more">
        <div className="video-player-more-title skeleton" />
        <div className="video-player-more-grid">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={`more-video-skeleton-${index}`} className="video-player-more-card">
              <div className="video-player-more-thumb skeleton" />
              <div className="video-player-more-line skeleton" />
              <div className="video-player-more-line skeleton short" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
