import type { Video } from "@/features/home/homeTypes";
import VideoCard from "./VideoCard";

type VideoGridProps = {
  videos: Video[];
  onSelect: (video: Video) => void;
  isLoading?: boolean;
};

const skeletonCount = 8;

function VideoSkeletonCard() {
  return (
    <div className="video-card skeleton-card" aria-hidden="true">
      <div className="video-card-body">
        <div className="video-skeleton-thumb skeleton" />
        <div className="video-skeleton-meta">
          <div className="video-skeleton-line skeleton" />
          <div className="video-skeleton-line skeleton short" />
          <div className="video-skeleton-line skeleton tiny" />
        </div>
      </div>
    </div>
  );
}

export default function VideoGrid({ videos, onSelect, isLoading = false }: VideoGridProps) {
  return (
    <section className="video-grid" aria-busy={isLoading}>
      {isLoading
        ? Array.from({ length: skeletonCount }, (_, index) => (
            <VideoSkeletonCard key={`video-skeleton-${index}`} />
          ))
        : videos.map((video) => <VideoCard key={video.id} video={video} onSelect={onSelect} />)}
    </section>
  );
}
