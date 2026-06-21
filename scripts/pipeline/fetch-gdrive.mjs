/**
 * AI Onboarded — Weekly Pipeline: Google Drive Fetcher
 *
 * Downloads the most recently modified .docx file from the
 * configured Google Drive folder and returns its plain text.
 *
 * Auth: Google Service Account (JSON key file)
 * Requires: googleapis, mammoth
 *   pnpm add googleapis mammoth
 */

import { google } from 'googleapis'
import mammoth from 'mammoth'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ── Configuration ──────────────────────────────────────────
const DRIVE_FOLDER_ID = process.env.GDRIVE_FOLDER_ID || '1W-bLJln7R2_DTLiz9npMnNKj3bClyKoe'
const SERVICE_ACCOUNT_KEY_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH || path.resolve(__dirname, '../../google-service-account.json')
const DOWNLOAD_DIR = path.resolve(__dirname, '../../tmp-pipeline')

// ── Auth ───────────────────────────────────────────────────
function getAuthClient() {
  if (!fs.existsSync(SERVICE_ACCOUNT_KEY_PATH)) {
    throw new Error(
      `Google Service Account key not found at: ${SERVICE_ACCOUNT_KEY_PATH}\n` +
      'See scripts/pipeline/SETUP.md for setup instructions.'
    )
  }

  return new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  })
}

// ── Find latest .docx OR Google Doc in folder ────────────
export async function findLatestDocx() {
  const auth = getAuthClient()
  const drive = google.drive({ version: 'v3', auth })

  console.log(`[Drive] Searching folder ${DRIVE_FOLDER_ID} for latest document...`)

  // Search for both .docx files AND native Google Docs
  const res = await drive.files.list({
    q: `'${DRIVE_FOLDER_ID}' in parents and (
      mimeType='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      or mimeType='application/vnd.google-apps.document'
    ) and trashed=false`,
    orderBy: 'modifiedTime desc',
    pageSize: 5,
    fields: 'files(id,name,mimeType,modifiedTime)',
  })

  const files = res.data.files || []
  if (files.length === 0) {
    throw new Error(`No documents found in Google Drive folder ${DRIVE_FOLDER_ID}`)
  }

  const latest = files[0]
  console.log(`[Drive] Found: "${latest.name}" (type: ${latest.mimeType}, modified: ${latest.modifiedTime})`)
  return latest
}

// ── Download file (or export Google Doc as docx) ──────────
export async function downloadFile(fileId, fileName, mimeType) {
  const auth = getAuthClient()
  const drive = google.drive({ version: 'v3', auth })

  if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true })
  }

  // Ensure local filename always ends in .docx
  const safeName = fileName.endsWith('.docx') ? fileName : `${fileName}.docx`
  const destPath = path.join(DOWNLOAD_DIR, safeName)
  const dest = fs.createWriteStream(destPath)

  console.log(`[Drive] Downloading to ${destPath}...`)

  let response
  if (mimeType === 'application/vnd.google-apps.document') {
    // Export native Google Doc as .docx
    console.log('[Drive] Exporting Google Doc as .docx...')
    response = await drive.files.export(
      { fileId, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      { responseType: 'stream' }
    )
  } else {
    // Download .docx directly
    response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    )
  }

  await new Promise((resolve, reject) => {
    response.data
      .on('end', resolve)
      .on('error', reject)
      .pipe(dest)
  })

  console.log(`[Drive] Downloaded successfully.`)
  return destPath
}

// ── Parse .docx → plain text ───────────────────────────────
export async function parseDocx(filePath) {
  console.log(`[Drive] Parsing ${filePath}...`)
  const result = await mammoth.extractRawText({ path: filePath })

  if (result.messages.length > 0) {
    console.warn('[Drive] Parse warnings:', result.messages.map(m => m.message).join(', '))
  }

  const text = result.value.trim()
  console.log(`[Drive] Parsed ${text.length} characters of text.`)
  return text
}

// ── Main export: fetch latest doc and return text ──────────
export async function fetchLatestNewsDocument() {
  const file = await findLatestDocx()
  const filePath = await downloadFile(file.id, file.name, file.mimeType)
  const text = await parseDocx(filePath)

  return {
    text,
    fileName: file.name,
    fileId: file.id,
    modifiedTime: file.modifiedTime,
  }
}

// ── CLI entrypoint (for testing) ───────────────────────────
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { text, fileName } = await fetchLatestNewsDocument()
  console.log('\n--- Document Preview (first 500 chars) ---')
  console.log(text.slice(0, 500))
  console.log(`--- Source: ${fileName} ---\n`)
}
