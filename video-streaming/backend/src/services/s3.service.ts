import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, S3_BUCKET_NAME } from "../config/s3.js";

const PRESIGNED_URL_EXPIRES_IN = 60 * 10; // 10 minutes

export const createUploadUrl = async (
  storageKey: string,
  mimeType: string
): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: storageKey,
    ContentType: mimeType,
  });

  return getSignedUrl(s3Client, command, {
    expiresIn: PRESIGNED_URL_EXPIRES_IN,
  });
};

export const createPlaybackUrl = async (
  storageKey: string
): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: storageKey,
  });

  return getSignedUrl(s3Client, command, {
    expiresIn: PRESIGNED_URL_EXPIRES_IN,
  });
};

export const createDownloadUrl = async (
  storageKey: string,
  filename: string
): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: storageKey,
    ResponseContentDisposition: `attachment; filename="${filename}"`,
  });

  return getSignedUrl(s3Client, command, {
    expiresIn: PRESIGNED_URL_EXPIRES_IN,
  });
};

export const headObject = async (storageKey: string) => {
  const command = new HeadObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: storageKey,
  });

  return s3Client.send(command);
};

export const deleteObject = async (storageKey: string): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: storageKey,
  });

  await s3Client.send(command);
};
