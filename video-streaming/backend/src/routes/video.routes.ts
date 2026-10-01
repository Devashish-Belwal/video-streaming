import { Router } from "express";
import { getVideosController, getVideoController, requestUploadUrlController, uploadCompleteController, playbackUrlController, downloadUrlController } from "../controllers/video.controller.js";


const router = Router();
router.get("/", getVideosController);
router.get("/:id/download-url", downloadUrlController);
router.get("/:id/playback-url", playbackUrlController);
router.get("/:id", getVideoController);
router.post("/upload-url", requestUploadUrlController);
router.post("/upload-complete", uploadCompleteController);

export default router;
