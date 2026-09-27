import { Response } from "express";

export const sendNotFound = (res: Response) => res.status(404).json({ error: "Not found" });
