# Kaya API

The public API behind server-backed Kaya tools. It is deliberately API-only: browser pages live on `www.kayaweb3.xyz`, while this service is deployed at `api.kayaweb3.xyz`.

## First endpoint: Paste

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/v1/health` | Deployment and MongoDB health check |
| `POST` | `/v1/pastes` | Create an expiring text paste |
| `GET` | `/v1/pastes/:code` | Read a paste as JSON |
| `GET` | `/v1/pastes/:code/raw` | Read paste body as plain text |

Create request body:

```json
{
  "content": "hello from Kaya",
  "customCode": "optional-code",
  "expiresInHours": 24
}
```

`customCode` is optional. Pastes expire automatically; MongoDB's TTL index removes expired records shortly after their expiry time.

## Start with Docker Compose

This directory is self-contained. It starts the API and a private MongoDB container with a persistent Docker volume; MongoDB is not exposed on a host port.

```bash
cd apps/api
cp .env.example .env
# Set PUBLIC_WEB_URL and CORS_ORIGIN in .env for the deployed domain.
docker compose up -d --build
docker compose ps
curl http://127.0.0.1:4000/v1/health
```

The API listens on `${API_PORT:-4000}`. Put a reverse proxy such as Caddy or Nginx in front of that port, then point `api.kayaweb3.xyz` to the server. Confirm `https://api.kayaweb3.xyz/v1/health` returns `status: ok` before connecting the frontend.

Add this Vercel environment value and redeploy the main site:

```text
NEXT_PUBLIC_API_BASE_URL=https://api.kayaweb3.xyz/v1
```

To update the service later:

```bash
docker compose up -d --build
docker compose logs -f api
```

## External MongoDB or local Node development

The Compose setup always uses its private `mongo` service. For Atlas or a separate MongoDB deployment, run the API directly with `MONGODB_URI` set in `.env`:

```bash
npm install
npm run dev
```
