import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetUserDownloadsQuery } from "@/features/home/homeApi";

export default function DownloadsPage() {
  const navigate = useNavigate();
  const { data: downloads = [] } = useGetUserDownloadsQuery();

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Downloads</h2>
          <p className="text-sm text-muted-foreground">
            Recently downloaded videos on this device.
          </p>
        </div>
        <div className="text-xs text-muted-foreground">{downloads.length} items</div>
      </div>

      {downloads.length === 0 ? (
        <Card className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">No downloads yet.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {downloads.map((item) => (
            <Card key={item.id} className="rounded-2xl border border-border bg-card p-3 shadow-sm">
              <div className="mb-3 h-24 overflow-hidden rounded-xl bg-muted">
                {item.video?.thumbnailUrl ? (
                  <img
                    src={item.video.thumbnailUrl}
                    alt={item.video.title}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="space-y-1">
                <div className="text-sm font-semibold truncate">{item.video?.title ?? "Video"}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {item.video?.description ?? "Downloaded video"}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {new Date(item.downloadedAt).toLocaleString()}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 gap-2 rounded-full px-3 text-xs"
                  onClick={() => navigate(`/watch/${item.video?.id}`)}
                >
                  <Play size={14} /> Play
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2 rounded-full px-3 text-xs"
                  onClick={() => navigate(`/watch/${item.video?.id}`)}
                >
                  <Download size={14} /> Open
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
