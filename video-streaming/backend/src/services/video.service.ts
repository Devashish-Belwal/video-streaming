import { readdirSync, statSync, writeFileSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { Video } from "../types/video.types.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const videosDir = join(__dirname, "../../videos");

const mimeMap: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".mkv": "video/x-matroska",
};

export const getVideoById = (id: string) => {
  const files = readdirSync(videosDir);
  const file = files.find((f) => f.replace(/\.[^.]+$/, "") === id && mimeMap[extname(f).toLowerCase()]);
  if (!file) return null;
  const stats = statSync(join(videosDir, file));
  return { id, filename: file, title: id.charAt(0).toUpperCase() + id.slice(1), size: stats.size, mimeType: mimeMap[extname(file).toLowerCase()], path: join(videosDir, file) };
};

export const uploadVideo = (file: Express.Multer.File) => {
  const ext = extname(file.originalname).toLowerCase();
  if (!mimeMap[ext]) {
    return null;
  }

  const filename = file.originalname;
  const id = filename.replace(/\.[^.]+$/, "");
  const destination = join(videosDir, filename);
  writeFileSync(destination, file.buffer);

  return { id, filename, title: id.charAt(0).toUpperCase() + id.slice(1), size: file.size, mimeType: mimeMap[ext], path: destination };
};

export const getVideos = (): Video[] => {
  try {
    const files = readdirSync(videosDir);
    return files
      .filter((f) => mimeMap[extname(f).toLowerCase()])
      .map((f) => {
        const stats = statSync(join(videosDir, f));
        const id = f.replace(/\.[^.]+$/, "");
        return {
          id,
          filename: f,
          title: id.charAt(0).toUpperCase() + id.slice(1),
          size: stats.size,
          mimeType: mimeMap[extname(f).toLowerCase()],
        };
      });
  } catch {
    return [];
  }
};