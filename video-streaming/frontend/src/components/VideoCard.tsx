import { Link } from "react-router-dom";
import type { Video } from "../types/video.types";

export default function VideoCard({ video }: { video: Video }) {
  return (
    <Link to={`/watch/${video.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div style={{ background: "#181B21", border: "1px solid #2A2F38", borderRadius: 10, padding: 16 }}>
        <strong>{video.title}</strong>
        <div style={{ fontSize: 13, color: "#9AA3B2" }}>{video.filename} · {video.mimeType}</div>
      </div>
    </Link>
  );
}
