import { Request, Response } from "express";
import { createReadStream } from "fs";
import { getVideos, getVideoById, uploadVideo } from "../services/video.service.js";
import { parseRange } from "../utils/video.utils.js";

export const streamVideo = (req: Request, res: Response) => {
  const video = getVideoById(req.params.id as string);
  if (!video || !video.path) return res.status(404).json({ error: "Video not found" });
  const fileSize = video.size;
  const range = parseRange(req.headers.range, fileSize);

  if (range === undefined) {
    res.setHeader("Content-Range", `bytes */${fileSize}`);
    return res.status(416).json({ error: "Range not satisfiable" });
  }

  if (range) {
    if (range.start >= fileSize || range.end >= fileSize || range.start < 0 || range.end < range.start) {
      res.setHeader("Content-Range", `bytes */${fileSize}`);
      return res.status(416).json({ error: "Range not satisfiable" });
    }
    const chunkSize = range.end - range.start + 1;
    res.status(206);
    res.setHeader("Content-Type", video.mimeType);
    res.setHeader("Content-Length", chunkSize);
    res.setHeader("Content-Range", `bytes ${range.start}-${range.end}/${fileSize}`);
    res.setHeader("Accept-Ranges", "bytes");
    const stream = createReadStream(video.path, { start: range.start, end: range.end });
    stream.on("error", () => res.status(500).json({ error: "Stream error" }));
    stream.pipe(res);
    return;
  }

  res.setHeader("Content-Type", video.mimeType);
  res.setHeader("Content-Length", fileSize);
  res.setHeader("Accept-Ranges", "bytes");
  const stream = createReadStream(video.path);
  stream.on("error", () => res.status(500).json({ error: "Stream error" }));
  stream.pipe(res);
};

export const getVideoController = (req: Request, res: Response) => {
  const video = getVideoById(req.params.id as string);
  if (!video) return res.status(404).json({ error: "Video not found" });
  const { path: _, ...rest } = video;
  res.json(rest);
};

export const uploadVideoController = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const result = uploadVideo(req.file);
  if (!result) {
    return res.status(400).json({ error: "Unsupported file type" });
  }

  const { path: _, ...rest } = result;
  res.status(201).json(rest);
};

export const downloadVideo = (req: Request, res: Response) => {
  const video = getVideoById(req.params.id as string);
  if (!video || !video.path) return res.status(404).json({ error: "Video not found" });
  res.download(video.path, video.filename, (err) => {
    if (err && !res.headersSent) {
      res.status(500).json({ error: "Download failed" });
    }
  });
};

export const getVideosController = (_req: Request, res: Response) => {
  res.json({ videos: getVideos() });
};
