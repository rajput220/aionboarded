# AI Onboarded — Weekly Pipeline Setup Guide

## Overview

This pipeline runs every Saturday at 6 AM EDT and:
1. Fetches your Word doc from Google Drive
2. Generates all content via Claude API
3. Publishes news items to Payload CMS
4. Builds the newsletter HTML
5. Emails all confirmed subscribers
6. Done by 8 PM EDT ✅

---

## Step 1: Install pipeline dependencies

```bash
pnpm add googleapis mammoth @anthropic-ai/sdk
```

---

## Step 2: Set up Google Cloud Service Account

This gives the pipeline read access to your Google Drive folder.

### 2a. Create a Google Cloud Project
1. Go to https://console.cloud.google.com
2. Create a new project (or use existing): **"AI Onboarded Pipeline"**

### 2b. Enable the Google Drive API
1. In your project, go to **APIs & Services → Library**
2. Search for **"Google Drive API"** → Enable it

### 2c. Create a Service Account
1. Go to **APIs & Services → Credentials**
2. Click **"Create Credentials" → "Service Account"**
3. Name: `ai-onboarded-pipeline`
4. Description: `Weekly newsletter pipeline`
5. Click **Create and Continue** → Skip optional steps → Done

### 2d. Download the JSON key
1. Click on your new service account
2. Go to the **Keys** tab
3. Click **"Add Key" → "Create new key" → JSON**
4. Save the file as `google-service-account.json` in the project root
5. ⚠️ **Add to .gitignore** — never commit this file

### 2e. Share the Drive folder with the service account
1. Open your Drive folder: https://drive.google.com/drive/folders/1W-bLJln7R2_DTLiz9npMnNKj3bClyKoe
2. Click **Share** (top right)
3. Paste the service account email (looks like: `ai-onboarded-pipeline@your-project.iam.gserviceaccount.com`)
4. Set permission to **Viewer**
5. Click **Share**

---

## Step 3: Add environment variables

Add these to your `.env` file:

```bash
# Pipeline authentication (generate a strong random string)
AGENT_API_KEY=your-secret-agent-api-key-here

# Claude API (get from https://console.anthropic.com)
ANTHROPIC_API_KEY=sk-ant-...

# Google Drive
GDRIVE_FOLDER_ID=1W-bLJln7R2_DTLiz9npMnNKj3bClyKoe
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./google-service-account.json

# Preview email for dry runs
AGENT_TEST_EMAIL=sanjay@youremail.com
```

---

## Step 4: Add GitHub Secrets (for the Actions scheduler)

Go to your GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**

Add all of these:

| Secret Name | Value |
|---|---|
| `AGENT_API_KEY` | Same as your .env |
| `ANTHROPIC_API_KEY` | Your Claude API key |
| `GDRIVE_FOLDER_ID` | `1W-bLJln7R2_DTLiz9npMnNKj3bClyKoe` |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | **The full contents** of google-service-account.json |
| `NEXT_PUBLIC_SITE_URL` | `https://aionboarded.ai` |
| `DATABASE_URL` | Your production database URL |
| `RESEND_API_KEY` | Your Resend API key |
| `AGENT_TEST_EMAIL` | Your email for dry-run previews |

---

## Step 5: Test the pipeline locally (dry run)

```bash
# Test Google Drive connection first
node scripts/pipeline/fetch-gdrive.mjs

# Test Claude content generation with a local text file
node scripts/pipeline/generate-content.mjs path/to/test.txt 15

# Run the full pipeline in dry run mode (no email blast, preview only)
node scripts/pipeline/run-weekly-pipeline.mjs --dry-run
```

---

## Step 6: Push to GitHub

The workflow file at `.github/workflows/weekly-publish.yml` will activate automatically once pushed.

```bash
git add .github/workflows/weekly-publish.yml
git add scripts/pipeline/
git add src/app/api/agent/
git commit -m "feat: automated weekly newsletter pipeline"
git push
```

---

## Manual Triggers

You can run the pipeline manually anytime from GitHub:

1. Go to your repo → **Actions → Weekly Newsletter Pipeline**
2. Click **"Run workflow"**
3. Options:
   - **Dry run**: sends preview email only to `AGENT_TEST_EMAIL`
   - **Skip email**: builds and ingests but doesn't send
   - **Force week number**: override automatic week detection

---

## Saturday Timeline (once live)

| Time (EDT) | What Happens |
|---|---|
| 6:00 AM | Pipeline fires automatically |
| 6:05 AM | Word doc fetched from Google Drive |
| 6:10 AM | Claude generates all content |
| 6:20 AM | News items ingested into Payload CMS |
| 6:25 AM | Old articles archived |
| 6:30 AM | Newsletter HTML built and committed |
| 6:35 AM | Preview email sent to you |
| 7:00 PM | *(configurable)* Full email blast sent |
| **8:00 PM** | ✅ Done |

> **Tip**: For the first few weeks, use `--dry-run` to review the generated content before it goes live. Once you're confident in the output quality, remove the flag.

---

## Troubleshooting

### "No .docx files found in Google Drive folder"
→ The service account doesn't have access to the folder. Re-check Step 2e.

### "Claude returned invalid JSON"
→ Check `tmp-pipeline/last-response.txt` for the raw Claude output.

### "AGENT_API_KEY missing"
→ Check your `.env` file and GitHub Secrets.

### Pipeline logs
→ After each run, check `tmp-pipeline/pipeline-YYYY-MM-DD.log` locally, or download the artifact from GitHub Actions.
