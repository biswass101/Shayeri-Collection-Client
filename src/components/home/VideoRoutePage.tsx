import { useNavigate, useParams } from "react-router-dom";
import { useGetVideoByIdQuery } from "@/features/home/homeApi";
import VideoPlayerPage from "@/components/home/VideoPlayerPage";
import { useUI } from "@/components/layout/UIContext";

export default function VideoRoutePage() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useUI();
  const { data: video } = useGetVideoByIdQuery(videoId ?? "", { skip: !videoId });

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
