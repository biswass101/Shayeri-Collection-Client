import type { Video } from "@/features/home/homeTypes";
import { Card, CardContent } from "@/components/ui/card";

type VideoCardProps = {
  video: Video;
  onSelect: (video: Video) => void;
};

export default function VideoCard({ video, onSelect }: VideoCardProps) {
  return (
    <Card
      className="group min-h-[320px] cursor-pointer overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-[0_10px_28px_rgba(0,0,0,0.14)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.2)]"
      onClick={() => onSelect(video)}
    >
      <CardContent className="flex h-full flex-col gap-3 p-3">
        <div className="relative h-40 w-full overflow-hidden rounded-xl bg-muted ring-1 ring-white/10">
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              {video.thumbnailLabel}
            </div>
          )}
          <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
            {video.duration}
          </div>
        </div>
        <div className="flex min-h-[100px] flex-1 flex-col rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
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
