# Portfolio — Monorepo

> Senior Full-Stack Developer portfolio built with Angular · Spring Boot · Go · PostgreSQL

## Stack

| Layer     | Technology              | Hosting         |
|-----------|-------------------------|-----------------|
| Frontend  | Angular 18 + Tailwind   | Vercel (free)   |
| API       | Spring Boot 3 / Java 21 | Render (free)   |
| Metrics   | Go 1.22 + Gin           | Render (free)   |
| Database  | PostgreSQL 16           | Aiven (free)    |
| CI/CD     | GitHub Actions          | GitHub (free)   |
| Registry  | Docker images           | GHCR (free)     |

## Folder Structure

```
portfolio/
├── .github/workflows/ci-cd.yml     # Full CI/CD pipeline
├── frontend/                        # Angular app → Vercel
├── services/
│   ├── portfolio-api/               # Spring Boot → Render
│   └── go-metrics/                  # Go service  → Render
├── infra/docker-compose.yml         # Local dev
└── .env.example                     # Required secrets
```

## Quick Start (Local Dev)

```bash
# 1. Copy and fill in secrets
cp .env.example .env

# 2. Start Postgres
docker compose -f infra/docker-compose.yml up postgres -d

# 3. Start Spring Boot
cd services/portfolio-api && mvn spring-boot:run

# 4. Start Go service
cd services/go-metrics && go run .

# 5. Start Angular
cd frontend && npm install && npm start
```

Open http://localhost:4200

Admin panel: http://localhost:4200/admin/login
- Username: `admin`  Password: `admin123`
- **Change the password hash in V1__init.sql before deploying**

## Deployment Guide

### 1. Aiven PostgreSQL

1. Create free account at [aiven.io](https://aiven.io)
2. Create a PostgreSQL service (free tier)
3. Copy the connection URI → use as `DB_URL`

### 2. Render (Backend Services)

**Spring Boot:**
1. New Web Service → Docker → point to `services/portfolio-api`
2. Set all env vars from `.env.example`
3. Copy the Deploy Hook URL → GitHub secret `RENDER_JAVA_DEPLOY_HOOK`

**Go service:**
1. New Web Service → Docker → point to `services/go-metrics`
2. Set env vars
3. Copy Deploy Hook → `RENDER_GO_DEPLOY_HOOK`

### 3. Vercel (Frontend)

```bash
cd frontend
npx vercel            # first time — follow prompts
npx vercel --prod     # subsequent deployments
```

Copy the Project ID and Org ID from `.vercel/project.json` → GitHub secrets.

### 4. GitHub Actions Secrets

Add these in **Settings → Secrets and variables → Actions**:

| Secret | Where to get it |
|--------|----------------|
| `VERCEL_TOKEN` | Vercel → Account → Tokens |
| `VERCEL_ORG_ID` | `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` |
| `RENDER_JAVA_DEPLOY_HOOK` | Render → Service → Settings |
| `RENDER_GO_DEPLOY_HOOK` | Render → Service → Settings |

### 5. Resend (Email)

1. Sign up at [resend.com](https://resend.com)
2. Add and verify your domain (or use the sandbox for testing)
3. Create an API key → use as `MAIL_PASSWORD`
4. Set `MAIL_FROM` to `noreply@yourdomain.com`

## Admin Panel

Navigate to `/admin/login`. Features:
- Manage Projects (CRUD + featured toggle)
- Manage Skills (proficiency bars)
- Write Blog Posts (with slug + publish toggle)
- Manage Testimonials (visible toggle)
- Read Messages (contact form inbox with unread count)

## DevOps Flex Widgets

Three live widgets on the public portfolio:

1. **Infrastructure Health** — polls Go `/metrics` every 30s, shows uptime, goroutines, memory
2. **CI/CD Pipeline** — fetches latest GitHub Actions runs via Go proxy
3. **Rate Calculator** — posts to Spring Boot `/rate-calculator`, returns project estimate

## Changing the Admin Password

Generate a new bcrypt hash (cost 12):
```java
// In any Java REPL or test:
new BCryptPasswordEncoder(12).encode("your-new-password")
```

Run a SQL update:
```sql
UPDATE admin_users SET password = '$2a$12$...' WHERE username = 'admin';
```
