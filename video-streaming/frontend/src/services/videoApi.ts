const API_BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:3000";

export interface Video {
  id: string;
  filename: string;
  title: string;
  size: number;
  mimeType: string;
  storageKey?: string;
  createdAt?: string;
}

export const getVideos = async (): Promise<{ videos: Video[] }> => {
  const res = await fetch(`${API_BASE}/videos`);
  if (!res.ok) throw new Error("Failed");
  return res.json();
};

export const getVideo = async (id: string): Promise<Video> => {
  const res = await fetch(`${API_BASE}/videos/${id}`);
  if (!res.ok) throw new Error("Failed");
  return (await res.json()) as Video;
};

export const getVideoDownloadUrl = async (id: string): Promise<string> => {
  const res = await fetch(`${API_BASE}/videos/${id}/download-url`);
  if (!res.ok) throw new Error("Download URL failed");
  const data = await res.json();
  return data.url;
};

export const getVideoPlaybackUrl = async (id: string): Promise<string> => {
  const res = await fetch(`${API_BASE}/videos/${id}/playback-url`);
  if (!res.ok) throw new Error("Playback URL failed");
  const data = await res.json();
  return data.url;
};


export const uploadVideo = async (file: File): Promise<Video> => {
  // 1. Request presigned upload URL
  const metaRes = await fetch(`${API_BASE}/videos/upload-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, mimeType: file.type || "video/mp4" }),
  });
  if (!metaRes.ok) throw new Error("Upload URL failed");
  const meta = (await metaRes.json()) as { videoId: string; storageKey: string; uploadUrl: string; expiresIn: number };

  // 2. PUT file directly to S3 (bytes never through Express)
  const putRes = await fetch(meta.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "video/mp4" },
    body: file,
  });
  if (!putRes.ok) throw new Error("S3 PUT failed");

  // 3. Notify backend upload is complete
  const completeRes = await fetch(`${API_BASE}/videos/upload-complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoId: meta.videoId, storageKey: meta.storageKey }),
  });
  if (!completeRes.ok) throw new Error("Upload complete failed");
  return (await completeRes.json()) as Video;
};
