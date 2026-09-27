export interface Video {
  id: string;
  filename: string;
  title: string;
  size: number;
  mimeType: string;
}

export const getVideos = async (): Promise<{ videos: Video[] }> => {
  const res = await fetch("http://localhost:3000/api/videos");
  if (!res.ok) throw new Error("Failed");
  return res.json();
};

export const getVideo = async (id: string): Promise<Video> => {
  const res = await fetch(`http://localhost:3000/api/videos/${id}`);
  if (!res.ok) throw new Error("Failed");
  return (await res.json()) as Video;
};

export const getVideoStreamUrl = (id: string): string =>
  `http://localhost:3000/api/videos/${id}/stream`;

export const uploadVideo = async (file: File): Promise<{ id: string; filename: string; title: string; size: number; mimeType: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("http://localhost:3000/api/videos", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
};
