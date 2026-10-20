# EHSP Unit 2 recovered Apps Script source: baseline review

Date: 20 October 2026. Evidence: owner's read-only clasp clone ZIP, 11 files (ten JS modules plus appsscript.json). This is a code-inspection report, not a security certification or deployment approval.

## Recovered source map

| Existing private Apps Script file | Main reusable behaviour | Decision |
|---|---|---|
| Code.js | Validates required workbook tabs | Reuse in setup validator |
| Auth.js | Validates auth schemas, initialises HMAC secret via Script Properties | Preserve, adapt to shared identity and schema |
| Registration.js | Validates registration, emails OTP, one-minute/three-per-hour challenge limits | Reuse with abuse-control review |
| OTPVerification.js | Constant-time hash comparison, five OTP attempts, OTP consumption and session creation | Preserve, test partial-write recovery |
| Session.js | Validates hashed four-hour session against verified learner | Reuse for shared learner identity |
| BankValidation.js | Checks private 40-question bank structure | Refactor for per-assessment configurations and academic approval |
| ExamEngine.js | Topic sampling, option randomisation, session persistence and resume | Extract reusable engine, retain Apps Script storage adapter |
| ExamScoring.js | Server-side grading, deadline enforcement, lock and results persistence | Extract reusable grader; address multi-write failures |
| LifecycleTest.js | Read-only selection, marking and timing lifecycle | Keep as private development regression fixture |
| IntegrationTest.js | Dedicated UAT session/result persistence and duplicate-submission checks | Keep in isolated non-production integration test suite |

## Evidence and current state

- The user-supplied source matches the named ten-module structure and manifest.
- No embedded HMAC secret, API token or high-entropy credential literal was identified by source inspection. Script Properties hold the real HMAC secret outside this archive.
- Registration.js includes a development/test email address, so do not casually publish the raw private source.
- Existing production Unit 2 workbook configuration remains `releaseStatus=SETUP_ONLY` and `questionBankStatus=PRIVATE_DRAFT_INACTIVE_REVIEW_REQUIRED`.
- Live gating in the historical Apps Script functions expects `LIVE` and `APPROVED_PRIVATE`, whereas the new public catalogue validator uses `PUBLISHED` and `APPROVED_ACTIVE`. These are NOT interchangeable. Resolve through an explicit approved deployment mapping, not a premature workbook edit.
- Unit 2 private draft bank was structurally tested, but academic approval and production activation are outstanding.
- The code has no learner-facing `HtmlService` examination application, certificate issuing service, or new public certificate verifier. It must not be deployed as complete.
- The existing Unit 1 registry has an unauthenticated public registration flow; do not reuse it as Unit 2's certificate authority.

## Concrete engineering gaps

1. **Configuration:** Unit 2 quota map, 20-question length, 15-question pass threshold, duration and two-attempt policy are embedded as constants. All must become server-owned assessment configuration selected by authorised assessment ID.
2. **Data model:** Legacy `ExamSessions` and `Results` rows use the learner ID but not the assessment ID. Design an additive engine schema (or new tables) for multi-course records without changing legacy Unit 2 UAT or any Unit 1 data.
3. **Persistence:** Result creation, exam status update and saved answers use separate spreadsheet writes. A failure between writes can leave inconsistent state. Define result uniqueness, idempotent replay, reconciliation, locks and incident logging.
4. **Resume:** `unit2StartExam` reconstructs an active attempt using the currently active question bank. If an assigned question becomes inactive during the attempt, resume fails. Load the original session's questions safely from protected data while retaining server-side control.
5. **Access controls:** Expose no direct raw question/scoring functions to an unauthorised learner. Use a browser-facing Apps Script HtmlService façade with authenticated `google.script.run` calls, rate limits and generic errors.
6. **Certification:** Certificate issuance must be server-controlled, unique, locked and idempotent. Public verification should only disclose permitted metadata; keep Unit 1 verifier intact.
7. **Question integrity:** The earlier PR #4 published answer keys. Treat that bank as compromised for a secure graded production exam. Require replacement/approval of the new private bank.
8. **Operational controls:** Concurrent requests, email abuse, interrupted writes, rate/quota limits, privacy and rollback remain to be assessed and tested in an isolated environment.

## First implementation increment

The public development-only files `src/exam-core.mjs` and `tests/exam-core.test.mjs` adapt *algorithms*, not confidential data, from the existing Unit 2 source.

- Configurable, quota-based selection and answer-order randomisation
- Public question payload without answer keys
- Server-authoritative scoring thresholds and deadlines
- Fail-closed invalid question/answer checks
- Synthetic Node tests for the Unit 2 approved policy and an alternative course-level assessment

The pure ESM module is **not yet deployable as an Apps Script module**. The next integration task is adapting it into the privately version-controlled Apps Script runtime via a build/export step while preserving existing authenticated wrappers and private state.

## Protected boundaries

- Never modify Unit 1 pages, certificate registry, deployments or learner data.
- Do not commit owner-provided raw source, real bank, learner data, test email records, script properties or secrets to this public repository.
- Never merge PR #4 as a production examination.
- Do not turn on exams, issue credentials, or merge draft PR #5 as a live feature based only on these tests.

## Next delivery sequence

1. Obtain a private source repository or equivalent restricted code workspace for the recovered ten files.
2. Integrate the reusable core through a new staging Apps Script project, with configuration mapping and assessment-aware storage adapter.
3. Build one learner-facing HtmlService flow with auth, start/resume, submit, result and a managed certificate service.
4. Run fresh end-to-end and concurrent UAT including recovery cases; perform academic bank approval.
5. Obtain explicit launch approval. Publish Unit 2 and only then onboard Units 3–6.
