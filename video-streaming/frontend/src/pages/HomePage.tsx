import { useEffect, useState, useRef } from "react";
import VideoList from "../components/VideoList";
import { getVideos, uploadVideo } from "../services/videoApi";
import type { Video } from "../types/video.types";

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    getVideos()
      .then((data) => setVideos(data.videos || []))
      .catch(() => setError("Unable to load videos"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async () => {
    if (!fileRef.current?.files?.length) return;
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    try {
      await uploadVideo(fileRef.current.files[0]);
      setUploadSuccess("Upload complete");
      if (fileRef.current) fileRef.current.value = "";
      load();
    } catch {
      setUploadError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p>Loading videos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  return (
    <div>
      <h1>Video Library2</h1>
      <div style={{ marginBottom: 24 }}>
        <h3>Upload video</h3>
        <input type="file" accept="video/*" ref={fileRef} />
        <button onClick={handleUpload} disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</button>
        {uploadSuccess && <p style={{ color: "green" }}>{uploadSuccess}</p>}
        {uploadError && <p style={{ color: "red" }}>{uploadError}</p>}
      </div>
      <VideoList videos={videos} />
    </div>
  );
}
