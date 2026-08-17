# Kaya API

The public API behind the server-backed Kaya tools. Browser pages run on `www.kayaweb3.xyz`; this service is intended for `api.kayaweb3.xyz`.

## Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/v1/health` | Deployment and MongoDB health check |
| `POST` | `/v1/pastes` | Create an expiring text, image, or mixed paste |
| `POST` | `/v1/uploads/images` | Create a five-minute S3 upload URL for an allowed image |
| `GET` | `/v1/pastes/:code` | Read a paste as JSON |
| `GET` | `/v1/pastes/:code/raw` | Read the text body as plain text |

Images never pass through the API container. The browser asks the API for a short-lived, single-object upload URL, uploads directly to S3, and then submits the S3 object key while the API verifies the object before creating the paste.

## Run with Docker Compose

```bash
cd apps/api
cp .env.example .env
# Set PUBLIC_WEB_URL and CORS_ORIGIN for the production domains.
docker compose up -d --build
docker compose ps
curl http://127.0.0.1:4000/v1/health
```

Compose starts a private MongoDB container with a persistent Docker volume. The API listens on `${API_PORT:-4000}`. Put Caddy or Nginx in front of that port and point `api.kayaweb3.xyz` to the server.

Set this Vercel environment value before deploying the frontend:

```text
NEXT_PUBLIC_API_BASE_URL=https://api.kayaweb3.xyz/v1
```

## Configure S3 image pastes

### 1. Create a dedicated bucket

Create a new general-purpose S3 bucket only for temporary Paste images. Use an Object Ownership setting of **Bucket owner enforced**. Do not use public ACLs. The application stores objects only below the `pastes/` prefix.

Set the following in `apps/api/.env`:

```dotenv
AWS_REGION=ap-southeast-1
S3_PASTE_BUCKET=kaya-paste-media-your-account
S3_PASTE_PREFIX=pastes
S3_PUBLIC_BASE_URL=https://kaya-paste-media-your-account.s3.ap-southeast-1.amazonaws.com
PASTE_MAX_IMAGE_BYTES=10485760
S3_UPLOAD_URL_TTL_SECONDS=300
```

Use an IAM role attached to the API host where possible. If the host cannot use a role, add `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` to `.env`; never commit them.

The API role or user needs only this policy, replacing the bucket name:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::kaya-paste-media-your-account/pastes/*"
    }
  ]
}
```

### 2. Permit public reads only for temporary images

New buckets block public policies by default. Retain ACL protections but allow a bucket policy for the `pastes/` prefix. Account- or organization-level Block Public Access settings can still override this configuration.

```bash
aws s3api put-public-access-block \
  --bucket kaya-paste-media-your-account \
  --public-access-block-configuration '{"BlockPublicAcls":true,"IgnorePublicAcls":true,"BlockPublicPolicy":false,"RestrictPublicBuckets":false}'

aws s3api put-bucket-policy \
  --bucket kaya-paste-media-your-account \
  --policy '{
    "Version":"2012-10-17",
    "Statement":[{
      "Sid":"PublicReadTemporaryPastes",
      "Effect":"Allow",
      "Principal":"*",
      "Action":"s3:GetObject",
      "Resource":"arn:aws:s3:::kaya-paste-media-your-account/pastes/*"
    }]
  }'
```

### 3. Allow direct browser uploads with bucket CORS

The browser needs `PUT` permission from the site origin to use a signed URL. Do not use `*` for `AllowedOrigins`.

```bash
aws s3api put-bucket-cors \
  --bucket kaya-paste-media-your-account \
  --cors-configuration '{
    "CORSRules":[{
      "AllowedOrigins":["https://kayaweb3.xyz","https://www.kayaweb3.xyz"],
      "AllowedMethods":["GET","PUT"],
      "AllowedHeaders":["content-type"],
      "ExposeHeaders":["ETag"],
      "MaxAgeSeconds":3000
    }]
  }'
```

### 4. Automatically delete images

Pastes can live for at most seven days. This lifecycle rule removes all objects under `pastes/` after eight days, including abandoned uploads. If you increase `PASTE_MAX_TTL_HOURS`, increase the lifecycle retention accordingly.

```bash
aws s3api put-bucket-lifecycle-configuration \
  --bucket kaya-paste-media-your-account \
  --lifecycle-configuration '{
    "Rules":[{
      "ID":"ExpireTemporaryPasteImages",
      "Status":"Enabled",
      "Filter":{"Prefix":"pastes/"},
      "Expiration":{"Days":8},
      "AbortIncompleteMultipartUpload":{"DaysAfterInitiation":1}
    }]
  }'
```

MongoDB's TTL index removes Paste records after their selected expiry; S3 Lifecycle handles the separate public image cleanup. Restart after adding S3 settings:

```bash
docker compose up -d --build
docker compose logs -f api
```

## External MongoDB or local Node development

Compose always uses its private `mongo` service. To use Atlas or another database, run the API directly with `MONGODB_URI` set in `.env`:

```bash
npm install
npm run dev
```
