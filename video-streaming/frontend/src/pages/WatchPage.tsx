import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import { getVideo, getVideoStreamUrl } from "../services/videoApi";

export default function WatchPage() {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getVideo(id)
      .then(setVideo)
      .catch(() => setError("Video not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error || !video) return <p style={{ color: "red" }}>{error || "Not found"}</p>;

  return (
    <div>
      <Link to="/">← Back</Link>
      <a href={`http://localhost:3000/api/videos/${id}/download`} download style={{ display: "inline-block", margin: "8px 0" }}>[ Download ]</a>
      <h2>{video.title}</h2>
      <VideoPlayer streamUrl={getVideoStreamUrl(id!)} />
      <p>{video.filename} · {video.mimeType}</p>
    </div>
  );
}
