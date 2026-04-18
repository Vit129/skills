# Data Backup & Integrity

Standards for ensuring data safety, persistence, and verification.

## Backup Workflow
1. **Trigger:** Automated (cron/LaunchAgent) or Manual (`npm run backup`)
2. **Naming:** Use timestamped folders `YYYY-MM-DD`
3. **Format:** JSON for structured data, CSV for spreadsheets
4. **Location:** `backups/` (Local) + External sync (Cloud/Sheets)

## Verification (AAA Pattern for Backups)
- **Acknowledge:** Confirm target folder creation
- **Audit:** Check existence of all required files
- **Analyze:** Verify record counts and file sizes (not empty)

## Project Specific: My Investment Port
- **Files:** `holdings.json`, `dividends.json`, `sectors.json`, `tax_inputs.json`, `rmf_funds.json`
- **Source:** Sync from Google Sheets tabs via GAS
- **Warning:** Alert if files are missing or contain 0 records
