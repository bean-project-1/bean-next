# Infrastructure — BEAN Platform

## Cloud Targets

- **Production**: Azure App Service (Web) + Azure Database for PostgreSQL
- **Alt CDN/Serverless**: Vercel (zero-config Next.js deployment)

## Deployment Options

### Option A — Vercel (recommended for v1)

```bash
vercel --prod
```

Set environment variables via the Vercel dashboard.

### Option B — Azure App Service

```bash
docker build -t bean-web .
docker tag bean-web <acr>.azurecr.io/bean-web:latest
docker push <acr>.azurecr.io/bean-web:latest
# Deploy via Azure App Service + Container Registry
```

## Environment Variables (Production)

See `.env.example` for the full list.
Critical variables for production:
- `DATABASE_URL`
- `OPENAI_API_KEY`
- `NEXTAUTH_SECRET`

## Future: Bicep / Terraform

IaC files for Azure will be added here as the platform matures.
