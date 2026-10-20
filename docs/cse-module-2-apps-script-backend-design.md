# Unit 2 Apps Script backend integration specification

Status: Design pending deployment. Date: 20 October 2026.

## Confirmed legacy behaviour

The supplied live `Code.gs` uses `SPREADSHEET_ID` pointing to the existing Certificate Registry and `SHEET_NAME = 'Certificate Registry'`. It routes any GET with `action=register` to `registerCertificate`, and all other GETs to `verifyCertificate`. POST JSON also calls `registerCertificate`. The registration function trusts browser-submitted `certificateId`, `score`, `passStatus`, and other fields. It checks only for nonempty certificate ID and duplicate IDs; it does **not** validate assessment completion. The verifier returns fields from 14 columns. Existing client `assets/js/certificate-registry.js` registers certificates by JSONP GET.

**Preserve the current deployment and the 14-column Certificate Registry for existing Unit 1 learners.** Do not replace the existing `Code.gs` until all current Unit 1 registrations and verifications have been regression-tested.

## Proposed architecture

A **new separate Google Apps Script project and new private Google Sheets workbook** for Unit 2 final exams, deployed under a separate endpoint. The authoritative Unit 2 question bank must **not** be stored in the public GitHub Pages repo. Restrict access to both the new workbook and the script to the owner.

### Private workbook tabs

- `Questions`: `id`, `topic`, `difficulty`, `question`, `option0`, `option1`, `option2`, `option3`, `correctOptionIndex`. Import and verify the author-approved 40 questions from `data/cse-module-2-questions.json`, then remove the answer-bearing file from any **public** branches before Unit 2 launches. Deleting it from current main/branches does not erase Git history; assume any published answers are compromised and **rotate the production bank**.
- `Learners`: `learnerId`, `email`, `name`, `verifiedAt`, `status`.
- `EmailChallenges`: `challengeId`, `learnerId`, `otpHash`, `expiresAt`, `attemptCount`, `verifiedAt`; rate-limit code requests, never expose the OTP in responses.
- `ExamSessions`: `sessionId`, `learnerId`, `moduleId`, `startAt`, `deadlineAt`, `attemptNumber`, `selectedQuestionIds`, `optionOrders`, `status`, `finishedAt`.
- `Responses`: `sessionId`, `questionId`, `chosenOption`, `submittedAt`; or store one JSON answer map per session in controlled server storage.
- `Results`: `sessionId`, `learnerId`, `moduleId`, `score`, `total`, `pass`, `evaluatedAt`, `certificateId`.
- `Certificates`: `certificateId`, `learnerId`, `course`, `module`, `score`, `total`, `issuedAt`, `status`, `registrySyncStatus`.

### API operations

1. `beginRegistration`: request one-time email verification using `MailApp`. Limit repeated sends and expiration.
2. `verifyEmail`: validate OTP against server-stored hash, return a short-lived unguessable session token; server stores token hash and expiration.
3. `startExam`: authenticate server token, acquire `LockService` lock, enforce 2 completed attempts and a single active attempt. Select question IDs by quotas 2/2/4/3/2/4/3. Return **only question text/options**, not answers or explanations. Store selected question IDs and option permutations server-side.
4. `saveAnswers` / `resumeExam`: validate session token and server-owned timer; store selections, but never accept client claims about timer/score.
5. `submitExam`: under a lock, check server deadline, selected question IDs and stored answers; compute score against private answer keys and record the result atomically. Reject repeat submissions/idempotently return recorded outcome.
6. `issueCertificate`: internal-only operation invoked following a verified score >=15/20. Generate server-controlled `EHSP-CSE2-YYYYMMDD-XXXXXX`, ensure ID uniqueness, persist authoritative certificate record. Never accept arbitrary client certificate IDs or scores.
7. `verifyCertificate`: read-only public lookup by certificate ID; return only non-sensitive certificate metadata. The public verification UI should accept both `EHSP-CSE1` and `EHSP-CSE2`.
8. `syncRegistry`: owner-authorised server-to-server synchronization of Unit 2 certificate records into the existing central registry, **or** extend the verification UI to query both registries (preferred for initial isolation). Do not use the legacy public `action=register` to assert authority.

### Google Apps Script precautions

- Use `LockService` around session creation, attempt counting, evaluation and certificate issuance to avoid simultaneous-request races.
- Enforce server-side timestamp and session deadlines; `localStorage` may only cache UI state.
- `ContentService` JSONP GET means request params and responses can execute as script. JSONP is inappropriate for sensitive operations like authentication, score submission or email verification; use a backend architecture that supports proper origin-safe POST and no token leakage, or host UI within Apps Script using `google.script.run`. `google.script.run` with `HtmlService` is a pragmatic low-cost option for this limited learner volume.
- Never expose answer keys, verified learner emails, access tokens or internal sheet IDs in public exam page data.
- Keep a basic attempt/audit log and define data retention, privacy notice and abuse limits.

## Engineering choice recommended

For the first production-safe Unit 2 examination, host the final examination screen as **Google Apps Script HtmlService**, using `google.script.run` to invoke server-side functions. Retain GitHub Pages for the course hub and mock exams; the Unit 2 final exam button opens the hosted HtmlService exam. This avoids trying to retrofit browser cross-origin auth over JSONP and costs no additional infrastructure for low monthly learner volumes. Branding can match the Skill Passport pages.

Separate Unit 2 certificate ID namespace and private storage keep Module 1 functioning. Once the new backend is validated and the existing registry integration has been understood, optionally unify verification across both sources.

## Release prerequisites

1. Create a copy of the current Certificate Registry spreadsheet as a backup. Do not delete or overwrite the 14-column original.
2. Create a **new private** Google Sheet and standalone Apps Script project for Unit 2.
3. Move/rotate the exam bank into the private workbook; remove public credential-bearing keys from the launch pathway.
4. Implement test OTP delivery, authorise Apps Script permissions, and verify anonymous learners cannot access sheets.
5. Exercise pass, fail, two attempts, timer expiry, page refresh, duplicate submissions and certificate issuance.
6. Add the public Unit 2 verification route; ensure existing CSE1 verification remains functional.
7. Only then change the Unit 2 landing page and course hub status to final-exam live.

## Important legacy caution

The current public Unit 1 endpoint retains an unauthenticated certificate registration operation. Its existing entries are still usable, but the records should not be assumed to prove assessment success cryptographically. A longer-term hardening effort should protect Unit 1 issuance without disrupting historical learners.
