# Required S3 CORS Configuration (DO NOT apply yet)
# For production frontend origin: https://your-domain.example

{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://your-domain.example"],
      "AllowedMethods": ["GET", "PUT", "POST", "HEAD", "DELETE"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag", "Content-Type", "Content-Length", "x-amz-server-side-encryption", "x-amz-request-id", "x-amz-id-2"],
      "MaxAgeSeconds": 3000
    }
  ]
}

Notes:
- PUT uploads: required for direct browser uploads to S3
- GET/playback: required for video playback
- HEAD/range: browsers may send HEAD or range-related requests
- AllowedHeaders includes Authorization, Content-Type, x-amz-* headers
- No AWS credentials exposed to browser; only presigned URLs generated server-side
