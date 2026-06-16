# Python ETL

This script fetches JSON data from `API_URL` and uploads it to a Google Cloud Storage bucket (default `DataLake`).

Setup

1. Create a virtualenv and install dependencies:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Copy `.env.example` to `.env` and set `API_URL` and optionally `API_KEY`.

3. Provide GCP credentials either by setting `GOOGLE_APPLICATION_CREDENTIALS` to a service account JSON file path, or by setting `GOOGLE_SERVICE_ACCOUNT_KEY` to the raw service account JSON (the script will write it to a temp file).

Run

```bash
python etl.py
```

The script will create files named like `data-YYYY-MM-DDTHH-MM-SS.json` in the configured GCS bucket.
