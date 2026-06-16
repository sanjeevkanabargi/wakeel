#!/usr/bin/env python3
"""Simple ETL: fetch JSON from API_URL and upload to GCS bucket."""
import os
import sys
import json
import tempfile
from datetime import datetime

import requests
from google.cloud import storage
from dotenv import load_dotenv

load_dotenv()

API_URL = os.getenv('API_URL')
API_KEY = os.getenv('API_KEY')
GCS_BUCKET = os.getenv('GCS_BUCKET', 'DataLake')
GCP_KEY = os.getenv('GOOGLE_SERVICE_ACCOUNT_KEY')

if not API_URL:
    print('ERROR: API_URL must be set', file=sys.stderr)
    sys.exit(1)

# If a service account JSON is provided in env, write it to a temp file and point GOOGLE_APPLICATION_CREDENTIALS
if GCP_KEY:
    fd, path = tempfile.mkstemp(prefix='gcp-key-', suffix='.json')
    with os.fdopen(fd, 'w') as f:
        f.write(GCP_KEY)
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = path


def fetch_api(url, api_key=None):
    headers = {}
    if api_key:
        headers['Authorization'] = f'Bearer {api_key}'
    resp = requests.get(url, headers=headers, timeout=30)
    resp.raise_for_status()
    return resp.json()


def upload_to_gcs(bucket_name, data, filename):
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(filename)
    blob.upload_from_string(json.dumps(data, indent=2), content_type='application/json')


def main():
    try:
        print('Fetching', API_URL)
        data = fetch_api(API_URL, API_KEY)
    except Exception as e:
        print('Failed to fetch API:', e, file=sys.stderr)
        sys.exit(2)

    timestamp = datetime.utcnow().isoformat(timespec='seconds').replace(':', '-')
    filename = f'data-{timestamp}.json'

    try:
        print('Uploading to bucket', GCS_BUCKET, 'as', filename)
        upload_to_gcs(GCS_BUCKET, data, filename)
    except Exception as e:
        print('Failed to upload to GCS:', e, file=sys.stderr)
        sys.exit(3)

    print('ETL completed successfully')


if __name__ == '__main__':
    main()
