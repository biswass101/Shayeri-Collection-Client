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
  const skeletonClass =
    "relative overflow-hidden bg-accent before:absolute before:inset-0 before:block before:content-[''] before:-translate-x-full before:bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.4)_50%,rgba(255,255,255,0)_100%)] before:animate-shimmer";

  return (
    <div className="mt-6 space-y-6" aria-busy="true">
      <div className={`${skeletonClass} h-7 w-28 rounded-full`} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <div className={`${skeletonClass} aspect-video w-full rounded-2xl`} />

          <div className="rounded-2xl border border-border bg-card p-4">
            <div className={`${skeletonClass} h-4 w-[65%] rounded-full`} />
            <div className={`${skeletonClass} mt-3 h-3 w-[45%] rounded-full`} />
            <div className="mt-4 flex flex-wrap gap-2">
              <div className={`${skeletonClass} h-9 w-28 rounded-full`} />
              <div className={`${skeletonClass} h-9 w-28 rounded-full`} />
              <div className={`${skeletonClass} h-9 w-28 rounded-full`} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className={`${skeletonClass} h-3 w-[40%] rounded-full`} />
          <div className={`${skeletonClass} mt-4 h-14 rounded-xl`} />
          <div className={`${skeletonClass} mt-3 h-14 rounded-xl`} />
          <div className={`${skeletonClass} mt-3 h-14 rounded-xl`} />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className={`${skeletonClass} h-3 w-[25%] rounded-full`} />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={`more-video-skeleton-${index}`} className="rounded-xl border border-border bg-background p-3">
              <div className={`${skeletonClass} h-20 w-full rounded-lg`} />
              <div className={`${skeletonClass} mt-3 h-3 w-full rounded-full`} />
              <div className={`${skeletonClass} mt-2 h-3 w-[70%] rounded-full`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
