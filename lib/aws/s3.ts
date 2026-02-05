import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'photography-portfolio-images';
const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL || '';

export interface UploadResult {
  key: string;
  url: string;
}

/**
 * Upload a file to S3
 * @param buffer - File buffer
 * @param key - S3 key (path)
 * @param contentType - MIME type
 * @returns Upload result with key and CloudFront URL
 */
export async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string = 'image/jpeg'
): Promise<UploadResult> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'max-age=31536000', // 1 year cache
  });

  await s3Client.send(command);

  // Return CloudFront URL
  const url = `${CLOUDFRONT_URL}/${key}`;

  return { key, url };
}

/**
 * Delete a file from S3
 * @param key - S3 key (path) to delete
 */
export async function deleteFromS3(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * Delete multiple files from S3
 * @param keys - Array of S3 keys to delete
 */
export async function deleteMultipleFromS3(keys: string[]): Promise<void> {
  await Promise.all(keys.map((key) => deleteFromS3(key)));
}

/**
 * Generate S3 key for image
 * @param galleryId - Gallery ID
 * @param imageId - Image ID
 * @param type - Image type (original, optimized, thumbnail)
 * @returns S3 key
 */
export function generateImageKey(
  galleryId: string,
  imageId: string,
  type: 'original' | 'optimized' | 'thumbnail'
): string {
  return `${type}/${galleryId}/${imageId}.jpg`;
}
