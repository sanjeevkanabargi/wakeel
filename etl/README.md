# ETL subproject

This small Node.js script fetches JSON data from `API_URL` and uploads it to a Google Cloud Storage bucket.

Setup:

1. Copy `.env.example` to `.env` and set `API_URL` and `GCS_BUCKET`.
2. Provide credentials either by setting `GOOGLE_APPLICATION_CREDENTIALS` to a service account JSON file path, or set `GOOGLE_SERVICE_ACCOUNT_KEY` to the raw JSON content (the script will write it to a temp file).

Install and run:

```bash
cd etl
npm install
npm start
```

The script will save a file named like `data-YYYY-MM-DDTHH-MM-SS.json` into the configured GCS bucket.
