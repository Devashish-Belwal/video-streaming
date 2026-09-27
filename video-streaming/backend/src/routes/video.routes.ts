import { Router } from "express";
import multer from "multer";
import { getVideosController, streamVideo, getVideoController, uploadVideoController, downloadVideo } from "../controllers/video.controller.js";

const uploadStorage = multer.memoryStorage();
const uploadRouter = multer({ storage: uploadStorage }).single('file');

const router = Router();
router.get("/", getVideosController);
router.get("/:id/download", downloadVideo);
router.get("/:id/stream", streamVideo);
router.get("/:id", getVideoController);
router.post("/", uploadRouter, uploadVideoController);

export default router;
