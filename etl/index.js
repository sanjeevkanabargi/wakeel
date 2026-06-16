require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { Storage } = require('@google-cloud/storage');

const API_URL = process.env.API_URL || '';
const API_KEY = process.env.API_KEY || '';
const BUCKET = process.env.GCS_BUCKET || '';

if (!API_URL) {
  console.error('Missing API_URL in environment');
  process.exit(1);
}
if (!BUCKET) {
  console.error('Missing GCS_BUCKET in environment');
  process.exit(1);
}

// If service account JSON is provided in env (base64 or raw), write to a temp file
if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
  const keyPath = path.join('/tmp', `gcp-key-${Date.now()}.json`);
  fs.writeFileSync(keyPath, process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  process.env.GOOGLE_APPLICATION_CREDENTIALS = keyPath;
}

async function run() {
  try {
    const headers = {};
    if (API_KEY) headers['Authorization'] = `Bearer ${API_KEY}`;
    console.log('Fetching', API_URL);
    const resp = await axios.get(API_URL, { headers, responseType: 'json' });
    const data = resp.data;

    const storage = new Storage();
    const bucket = storage.bucket(BUCKET);

    const filename = `data-${new Date().toISOString().replace(/[:.]/g,'-')}.json`;
    const file = bucket.file(filename);

    console.log('Uploading to', `${BUCKET}/${filename}`);
    await file.save(JSON.stringify(data, null, 2), { contentType: 'application/json' });
    console.log('Upload complete');
  } catch (err) {
    console.error('ETL error', err.message || err);
    process.exit(2);
  }
}

run();
