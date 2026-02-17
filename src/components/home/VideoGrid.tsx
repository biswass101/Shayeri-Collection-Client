import type { Video } from "@/features/home/homeTypes";
import VideoCard from "./VideoCard";

type VideoGridProps = {
  videos: Video[];
  onSelect: (video: Video) => void;
  isLoading?: boolean;
};

const skeletonCount = 8;
const skeletonClass =
  "relative overflow-hidden bg-accent before:absolute before:inset-0 before:block before:content-[''] before:-translate-x-full before:bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.4)_50%,rgba(255,255,255,0)_100%)] before:animate-shimmer";

function VideoSkeletonCard() {
  return (
    <div
      className="rounded-2xl border border-border bg-card p-3 shadow-sm"
      aria-hidden="true"
    >
      <div className="flex h-full flex-col gap-3">
        <div className={`${skeletonClass} h-40 w-full rounded-xl`} />
        <div className="flex min-h-[100px] flex-col gap-2 rounded-xl bg-secondary p-3 shadow-[inset_0_0_0_1px_hsl(var(--border))]">
          <div className={`${skeletonClass} h-3 w-full rounded-full`} />
          <div className={`${skeletonClass} h-3 w-[70%] rounded-full`} />
          <div className={`${skeletonClass} h-3 w-[45%] rounded-full`} />
        </div>
      </div>
    </div>
  );
}

export default function VideoGrid({ videos, onSelect, isLoading = false }: VideoGridProps) {
  return (
    <section
      className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-busy={isLoading}
    >
      {isLoading
        ? Array.from({ length: skeletonCount }, (_, index) => (
            <VideoSkeletonCard key={`video-skeleton-${index}`} />
          ))
        : videos.map((video) => <VideoCard key={video.id} video={video} onSelect={onSelect} />)}
    </section>
  );
}
