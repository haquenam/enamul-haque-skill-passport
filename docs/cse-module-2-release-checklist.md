# Unit 2 Final Assessment — Integration and Release Checklist

**Date:** 20 October 2026  
**Status:** STAGED / NOT LIVE  
**Branch:** `feature/cse-module-2-final-assessment`  
**Live Module 1:** unchanged.

## Agreed learner experience

1. Read the Unit 2 learning materials at the GitBook site.
2. Complete the unlimited ten-question practice mock (already published).
3. Register for Unit 2 independently of Module 1.
4. Take twenty MCQs selected by topic from the author-approved forty-question bank.
5. Complete the exam within 25 minutes; automatic submission when time expires.
6. Pass with at least 15 correct (75%), maximum two final attempts.
7. Once authoritative grading is available, issue a Unit 2 certificate with an `EHSP-CSE2-YYYYMMDD-XXXXXX` ID; verify through the central registry.

## Files added to the feature branch

| File | Role |
| --- | --- |
| `data/cse-module-2-questions.json` | 40 approved questions including correct answers; for staging only |
| `docs/cse-module-2-assessment-blueprint.md` | Exam policy and topic distribution |
| `cse-module-2-register.html` | Separate registration and Unit 2 browser storage |
| `cse-module-2-final-exercise.html` | Timed, 20-question browser-only examination preview |
| `cse-module-2-certificate-preview.html` | Watermarked sample of the Unit 2 certificate design; no issuer signature, ID or registry write |

The publicly published `cse-module-2.html` and `cse-module-2-mock-exam.html` remain unchanged. The CSE assessment hub still labels Unit 2 final examination **coming soon**.

## Sampling logic

The final exam samples 20 questions without replacement, then randomises question order and option order.

| Topic | Bank | Selected per attempt |
| --- | ---: | ---: |
| ICT | 4 | 2 |
| Data and information | 4 | 2 |
| Data collection and visualisation | 8 | 4 |
| Binary numbers | 6 | 3 |
| ASCII and Unicode | 4 | 2 |
| Database and SQL | 8 | 4 |
| Multimedia/text encoding | 6 | 3 |
| **Total** | **40** | **20** |

## Functional checks completed in JavaScript harness

- All staged HTML inline JavaScript blocks compiled without syntax errors.
- Exam content contains 40 bank questions and 20 questions selected for the final attempt.
- Verified topic distribution for one complete selection: 2/2/4/3/2/4/3.
- Successfully simulated a 20/20 pass; provisional result had `certificateEligible: false`.
- Verified question selection and saved answer survive page reload.
- Confirmed countdown expiry causes automatic submission.
- Confirmed two recorded failed attempts block the third in the same browser.
- Checked that Unit 2 uses independent `ehsp_cse_module_2_...` storage keys and does not change Module 1.
- Confirmed certificate preview creates no certificate ID or central registry record.

**These are static and simulated client-side checks, not a full deployed end-to-end browser test.**

## Release blockers — important

The Module 1 prototype grades in browser JavaScript. Unit 2's production certificates should **not** replicate this insecure trust model. The new question bank already exists in a public GitHub repository's review branch, so its correct answers are publicly accessible.

Before exposing the Unit 2 final assessment publicly and issuing certificates:

1. Move authoritative answer keys into a backend inaccessible to learners, such as a private restricted Google Sheet with Apps Script or another access-controlled backend. Merely hiding an answer-key URL is not sufficient.
2. Introduce a server-generated exam session with 20 randomly selected question IDs and option orders, a signed/opaque session token, and a server-enforced 25-minute deadline.
3. Grade answers server-side and enforce the maximum two final attempts against a verified learner identity. Browser `localStorage` alone cannot enforce this policy.
4. Issue the Unit 2 certificate ID and registry entry **from the backend only after a verified 15/20 pass**, instead of accepting browser-submitted scores or self-generated IDs.
5. Extend the public verification parser to accept `EHSP-CSE2` while preserving existing `EHSP-CSE1` verification, and display registry-derived fields rather than trusting certificate-link parameters.
6. Test multiple learners, incorrect answers, exhausted attempts, timer expiry, reconnect/resume, registry outages, PDF/PNG generation and certificate verification.
7. Confirm privacy disclosures and data retention for any collected learner name, email and assessment records.

The current deployed Google Apps Script **certificate registry endpoint** is a storage/lookup component; the available repository does not contain an authenticated grading service or the source for the bound Apps Script. Publishing the staged browser-only exam would not solve the above controls.

## Publication plan

After server integration passes validation:

- Convert the staged examination preview to submit answers to a trusted grading service.
- Replace the watermarked certificate preview with a backend-issued real Unit 2 certificate and PDF/PNG sharing flow.
- Enable Unit 2 registration/final links on `cse-module-2.html` and the six-unit hub `cse-assessments.html`.
- Keep Module 1 as-is and confirm `EHSP-CSE1` certificates still verify.

## GitBook scope note

Three early-ICT lesson questions `CSE2-Q002`, `CSE2-Q003`, and `CSE2-Q004` were approved by the course author, but their complete source lesson text was not independently retrievable at drafting time. Check their precise source alignment before final production deployment.
