import VideoCard from "./VideoCard";
import type { Video } from "../types/video.types";
export default function VideoList({ videos }: { videos: Video[] }) {
  if (!videos.length) return <p>No videos available</p>;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
      {videos.map((v) => <VideoCard key={v.id} video={v} />)}
    </div>
  );
}
