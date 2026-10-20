# EHSP Universal Assessment Engine v1.0 — delivery checklist

Last evidence review: 20 October 2026. Status: DEVELOPMENT; nothing authorised for production.

## Completed and evidenced
- [x] Inspected public GitHub main branch; Unit 1 live pages and registry integration identified, not modified.
- [x] Inspected unmerged PR #4. It contains public answer keys and a browser-scored prototype; **do not merge for production**.
- [x] Verified the private Unit 2 workbook tabs, approved settings and read-only UAT evidence.
- [x] UAT evidence: 15/20 passing result, submitted session and expired session in dedicated UAT tabs.
- [x] Established draft PR #5 with a multi-course catalogue, Unit 2 assessment configuration, pure validation, tests and CI.
- [x] CI configuration and tests passed on the development branch.

## Critical path / next steps
- [ ] **BLOCKED: One-time retrieve the existing ten-file Apps Script source.** The Google Drive connection lists the workbook but does not expose the bound script source. Obtain it securely, preferably with `clasp pull`. Do not paste authentication secrets or question answers into the public repository.
- [ ] Build reusable configuration loading on the existing tested Apps Script code. Preserve the existing Unit 2 logic, adapt rather than rewrite.
- [ ] Complete one secure learner-facing HtmlService examination flow with server-authoritative scoring, timing and attempts.
- [ ] Implement locked, idempotent certificate issuance and read-only public verification for new engine credentials.
- [ ] Complete endpoint, concurrent-access, failure-recovery, privacy and academic question review tests.
- [ ] Obtain explicit release approval before changing private workbook `releaseStatus=SETUP_ONLY` or question bank status.

## Protected boundaries
- Unit 1 source, sheets, certificate registry, endpoints and deployed pages are excluded from this work.
- Keep the private 40-question bank **inactive and unapproved**. The earlier PR #4 public bank is exposed, so treat those answer keys as unsuitable for secure production use.
- The public GitHub catalogue is metadata only; it is **not** a certificate authority or active examination endpoint.
- Plans for CSE Units 3–6 and course-final exams remain in the catalogue scope only; no unapproved exam policy has been set.

## Verified links
- Existing website: https://haquenam.github.io/enamul-haque-skill-passport/
- Current backend workbook: https://docs.google.com/spreadsheets/d/1Gltrbxl4FS-ISiGCikuRTEqUMNmx-hYg9hcm3Xr9mx0/edit
- New draft change: https://github.com/haquenam/enamul-haque-skill-passport/pull/5
