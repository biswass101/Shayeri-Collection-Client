import type { Video } from "@/features/home/homeTypes";
import { Card, CardContent } from "@/components/ui/card";

type VideoCardProps = {
  video: Video;
  onSelect: (video: Video) => void;
};

export default function VideoCard({ video, onSelect }: VideoCardProps) {
  return (
    <Card className="video-card cursor-pointer min-h-[320px] overflow-hidden" onClick={() => onSelect(video)}>
      <CardContent className="video-card-body flex h-full flex-col gap-3">
        <div className="relative h-40 w-full overflow-hidden rounded-xl bg-muted">
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              {video.thumbnailLabel}
            </div>
          )}
          <div className="video-duration">{video.duration}</div>
        </div>
        <div className="video-meta flex flex-1 flex-col min-h-0">
          <h3 className="video-title truncate">{video.title}</h3>
          <p className="video-subtitle truncate">{video.subtitle}</p>
          <div className="video-stats mt-auto">
            <span>{video.views}</span>
            <span>•</span>
            <span>{video.uploaded}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
