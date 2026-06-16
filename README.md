# Wakeel Chat — simple ChatGPT-like web UI

This project provides a minimal chat UI that forwards messages to OpenAI's Chat Completions API.

Quick start:

1. Copy `.env.example` to `.env` and set `OPENAI_API_KEY`.
2. Install dependencies:

```bash
npm install
```

3. Run:

```bash
npm start
```

4. Open http://localhost:3000

Docker
------

Build the container locally:

```bash
docker build -t wakeel-chat:latest .
```

Run with an env var (recommended):

```bash
docker run -p 3000:3000 -e OPENAI_API_KEY="$OPENAI_API_KEY" wakeel-chat:latest
```

Or use `docker-compose` with an `.env` file containing `OPENAI_API_KEY`:

```bash
docker compose up -d --build
```

Publish to a registry (Docker Hub example):

```bash
# tag and push
docker tag wakeel-chat:latest yourdockerhubuser/wakeel-chat:latest
docker push yourdockerhubuser/wakeel-chat:latest
```

Google Container Registry / Artifact Registry quick steps:

```bash
# Build and tag
docker build -t gcr.io/PROJECT-ID/wakeel-chat:latest .
# Authenticate & push
gcloud auth configure-docker
docker push gcr.io/PROJECT-ID/wakeel-chat:latest
```

When running on a GCP VM or Cloud Run, ensure `OPENAI_API_KEY` is set in the instance/service environment and open port `3000` (or map to port 80 in the container run command).

Reverse proxy (Nginx)
---------------------

The repo includes a simple Nginx reverse-proxy configuration at `nginx/default.conf` and a `docker-compose.yml` that runs `nginx` in front of the app on port `80`.

To run the full stack locally:

```bash
OPENAI_API_KEY="$OPENAI_API_KEY" docker compose up -d --build
# browse to http://localhost
```

CI / Auto-publish
------------------

A GitHub Actions workflow is included at `.github/workflows/docker-publish.yml`. Configure the following repository secrets to enable publishing:

- `DOCKERHUB_USERNAME` — your Docker Hub username
- `DOCKERHUB_TOKEN` — a Docker Hub access token (or password)
- `DOCKERHUB_REPO` — image name e.g. `youruser/wakeel-chat`

Optional: to push to Google Container Registry (GCR) set `GCP_SA_KEY` (service account JSON) and `GCP_PROJECT` secrets.
# wakeel