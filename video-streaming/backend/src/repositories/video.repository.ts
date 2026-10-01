import { db } from "../prisma/db.js";

export const getVideos = async () => db.video.findMany();
export const getVideoById = async (id: string) => db.video.findUnique({ where: { id } });
export const createVideo = async (data: any) => db.video.create({ data });
export const deleteVideo = async (id: string) => db.video.delete({ where: { id } });
