import type { Video } from "@/features/home/homeTypes";
import VideoCard from "./VideoCard";

type VideoGridProps = {
  videos: Video[];
  onSelect: (video: Video) => void;
};

export default function VideoGrid({ videos, onSelect }: VideoGridProps) {
  return (
    <section className="video-grid">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} onSelect={onSelect} />
      ))}
    </section>
  );
}
