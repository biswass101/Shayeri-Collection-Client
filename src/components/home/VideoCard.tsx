import type { Video } from "@/features/home/homeTypes";
import { Card, CardContent } from "@/components/ui/card";

type VideoCardProps = {
  video: Video;
  onSelect: (video: Video) => void;
};

export default function VideoCard({ video, onSelect }: VideoCardProps) {
  return (
    <Card
      className="min-h-[320px] cursor-pointer overflow-hidden rounded-2xl"
      onClick={() => onSelect(video)}
    >
      <CardContent className="flex h-full flex-col gap-3 p-3">
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
          <div className="absolute bottom-2 right-2 rounded-md bg-foreground px-1.5 py-0.5 text-[10px] font-semibold text-background">
            {video.duration}
          </div>
        </div>
        <div className="flex min-h-[100px] flex-1 flex-col rounded-xl bg-secondary p-3 shadow-[inset_0_0_0_1px_hsl(var(--border))]">
          <h3 className="truncate text-sm font-semibold text-foreground">{video.title}</h3>
          <p className="mt-2 truncate text-xs text-muted-foreground">{video.subtitle}</p>
          <div className="mt-auto flex gap-2 text-[11px] text-muted-foreground">
            <span>{video.views}</span>
            <span>•</span>
            <span>{video.uploaded}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
