import { Request, Response } from "express";
import crypto from "crypto";
import { getVideos, getVideoById } from "../services/video.service.js";
import { createUploadUrl, createPlaybackUrl, createDownloadUrl, headObject } from "../services/s3.service.js";
import { createVideo, getVideoById as getVideoByIdDB } from "../repositories/video.repository.js";

export const getVideoController = async (req: Request, res: Response) => {
  const video = await getVideoById(req.params.id as string);
  if (!video) return res.status(404).json({ error: "Video not found" });
  res.json(video);
};



export const getVideosController = async (_req: Request, res: Response) => {
  res.json({ videos: await getVideos() });
};

// S3 direct-upload endpoints
export const requestUploadUrlController = async (req: Request, res: Response) => {
  try {
    const { filename, mimeType } = req.body || {};
    if (!filename || typeof filename !== "string") return res.status(400).json({ error: "filename required" });
    if (!mimeType || typeof mimeType !== "string") return res.status(400).json({ error: "mimeType required" });
    const ALLOWED_MIME_TYPES = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/x-matroska",
      "video/mkv",
    ];
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) return res.status(400).json({ error: "unsupported mimeType" });
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "").replace(/\.{2,}/g, ".");
    if (!safeName || safeName.length > 200) return res.status(400).json({ error: "invalid filename" });
    if (safeName.includes("/") || safeName.includes("\\") || safeName.startsWith(".") || safeName.endsWith(".")) {
      return res.status(400).json({ error: "invalid filename" });
    }
    const id = crypto.randomUUID();
    const storageKey = `videos/${id}/${safeName}`;
    const url = await createUploadUrl(storageKey, mimeType);
    res.json({ videoId: id, storageKey, uploadUrl: url, expiresIn: 600 });
  } catch (e: any) {
    res.status(500).json({ error: "Upload URL failed" });
  }
};

export const downloadUrlController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const video = await getVideoByIdDB(id);
    if (!video) return res.status(404).json({ error: "Video not found" });
    if (!video.storageKey) return res.status(404).json({ error: "No S3 download available" });
    const url = await createDownloadUrl(video.storageKey, video.filename);
    res.json({ url, expiresIn: 600 });
  } catch (e: any) {
    res.status(500).json({ error: "Download URL failed" });
  }
};

export const playbackUrlController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const video = await getVideoByIdDB(id);
    if (!video) return res.status(404).json({ error: "Video not found" });
    if (!video.storageKey) return res.status(404).json({ error: "No S3 playback available" });
    const url = await createPlaybackUrl(video.storageKey);
    res.json({ url, expiresIn: 600 });
  } catch (e: any) {
    res.status(500).json({ error: "Playback URL failed" });
  }
};

export const uploadCompleteController = async (req: Request, res: Response) => {
  try {
    const { videoId, storageKey } = req.body || {};
    if (!videoId || typeof videoId !== "string") return res.status(400).json({ error: "videoId required" });
    if (!storageKey || typeof storageKey !== "string") return res.status(400).json({ error: "storageKey required" });
    const expectedPrefix = `videos/${videoId}/`;
    const parts = storageKey.split("/");
    if (parts.length !== 3 || parts[0] !== "videos" || parts[1] !== videoId || !parts[2]) return res.status(403).json({ error: "storageKey does not match video" });
    const existing = await getVideoByIdDB(videoId);
    if (existing) {
      return res.status(200).json({ id: existing.id, filename: existing.filename, title: existing.title, size: existing.size, mimeType: existing.mimeType, storageKey: existing.storageKey, createdAt: existing.createdAt });
    }
    const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB
    const head = await headObject(storageKey);
    if (!head || head.ContentLength === undefined || head.ContentLength === null) return res.status(404).json({ error: "S3 object not found" });
    if (head.ContentLength > MAX_FILE_SIZE) return res.status(413).json({ error: "File exceeds maximum allowed size" });
    const filename = storageKey.slice(expectedPrefix.length) || "unknown";
    const title = filename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    const record = await createVideo({
      id: videoId,
      filename,
      title: title.charAt(0).toUpperCase() + title.slice(1),
      size: Number(head.ContentLength) || 0,
      mimeType: head.ContentType || "application/octet-stream",
      storageKey,
      createdAt: new Date(),
    });
    res.status(201).json({ id: record.id, filename: record.filename, title: record.title, size: record.size, mimeType: record.mimeType, storageKey: record.storageKey, createdAt: record.createdAt });
  } catch (e: any) {
    res.status(500).json({ error: "Upload complete failed" });
  }
};
