# EHSP Unit 2 — one-time source capture

Status: one-time authenticated local export required; NOT a deployment.

## Existing project
The Unit 2 Apps Script is bound to the private Unit 2 Google Sheet. Use the **Script ID** displayed under Apps Script > Project Settings. Do not put the ID, OAuth credentials, answer keys or learner records in this public repository.

Google Drive/Sheets read access does not imply access to bound Apps Script project source. The available connector cannot directly retrieve this code. The project owner must authorise `clasp` once from their own machine.

## One-time read-only procedure (Windows PowerShell)

1. Use Node.js 20+ and visit https://script.google.com/home/usersettings to enable the Apps Script API if disabled.
2. In a new empty local directory run the following commands, replacing `YOUR_SCRIPT_ID` with the actual script ID:

```powershell
npx.cmd --yes @google/clasp@latest login
npx.cmd --yes @google/clasp@latest clone-script "YOUR_SCRIPT_ID"
```

These actions retrieve source; they do not publish or overwrite the existing Apps Script project. **Do not run `clasp push` or deploy against the current instance.**

3. Package only the recovered `.gs`, `.html` and `appsscript.json` files. Explicitly exclude `.clasprc.json`, `.clasp.json` and any OAuth token files. Check source for hard-coded passwords, tokens and client secrets before sharing.
4. Supply the inspected source through a private review channel such as the existing ChatGPT project conversation. Do not commit it to this public repository.

A Windows export helper has been prepared separately for the project owner to perform the clone, package only permitted source files and save a ZIP locally.

## After source is received
- Preserve all ten Apps Script modules and their functions as the Unit 2 baseline.
- Review authentication, OTP, sessions, selection, scoring and UAT interfaces without re-running successful tests.
- Store reviewed source in a private, version-controlled backend repository or other appropriate access-controlled repository.
- Refactor toward the shared assessment catalogue on a non-production development project.
- Keep Unit 1 unchanged and Unit 2 `SETUP_ONLY` until authoritative certificate issuance, verification, end-to-end UAT and release approval.

## Security note
The original Unit 2 source may contain protected implementation details. GitHub PR #4 also exposes the earlier answer bank; those answers must not become the production exam bank without replacement and academic approval.
