# CSE For Non CSE Students — Unit 2 Assessment Blueprint

**Course unit:** Unit 2: Data and Analysis (ICT) / ইউনিট ২: ডেটা এবং বিশ্লেষণ  
**Status:** DRAFT — awaiting author/content review. Not available to learners.  
**Date:** 20 October 2026  
**Data file:** `data/cse-module-2-questions.json`  
**Reference unit:** https://haquenam.gitbook.io/learningwithenam/cse

## Purpose

A short, independent completion assessment for learners who have watched the Unit 2 videos, read the corresponding GitBook lessons, and attempted the existing Unit 2 exercises. This is educational recognition issued by Enamul Haque Skill Passport, not academic credit or an accredited professional qualification.

## Policy agreed for Unit 2

| Parameter | Decision |
| --- | --- |
| Final assessment | 20 four-option MCQs |
| Time limit | 25 minutes |
| Pass mark | 75% |
| Minimum correct | 15 of 20 |
| Maximum final attempts | 2 (subject to central enforcement) |
| Mock exam | 10 separate practice questions, planned; unlimited practice |
| Bank | 40 distinct, original draft questions |
| Language | Natural Bangla; familiar technical terms rendered naturally |
| Certificate | Unit 2 completion certificate only when a verified pass is recorded |
| Proposed certificate ID prefix | `EHSP-CSE2-` (subject to backend integration) |
| Registration | Reuse the existing learner registration experience; separate Unit 2 attempt record |

**Module 1 is not changed by this design.** Its 50-question, 60-minute assessment and certificate flow should continue operating independently.

## Exam topic distribution

| Topic code | Coverage | Questions in bank | Questions in each attempt |
| --- | --- | ---: | ---: |
| `ict` | IT revolution, ICT and integration | 4 | 2 |
| `data-info` | Data, information, structured and unstructured data | 4 | 2 |
| `collection-viz` | Surveys, observation, interviews, cleaning, analysis, charts | 8 | 4 |
| `binary` | Bits, bytes, binary and data transmission | 6 | 3 |
| `unicode` | ASCII, Unicode, code points, emoji | 4 | 2 |
| `database-sql` | Tables, records, fields, SQL, relational/document databases | 8 | 4 |
| `encoding` | Text, Python UTF-8, audio/video/image encoding | 6 | 3 |
| **Total** | | **40** | **20** |

When the exam engine is adapted, select the specified number from each topic without replacement, then shuffle questions and answer options. Store the original question ID with each graded response. Do not use the fixed first 20 questions or select across the entire bank without preserving topic coverage.

## Source mapping and review confidence

The draft was developed from GitBook Unit 2 outline, lesson content and the existing 20-question **practice** exercise. The examination questions are newly written rather than copied from that exercise.

| Unit 2 lesson | GitBook location | Review level |
| --- | --- | --- |
| Course outline | `cse/cse4ncseunit2/unit2video1` | Text reviewed |
| IT revolution | `cse/cse4ncseunit2/unit2video2` | Page title available; full lesson not retrieved |
| Three phases of the information age | `cse/cse4ncseunit2/unit2video3` | Page title available; full lesson not retrieved |
| ICT evolution/integration | `cse/cse4ncseunit2/unit2video4` and `unit2video5` | Titles available; full lessons not retrieved |
| Collecting data, charts and visualisation | `cse/cse4ncseunit2/unit2video6` | Text reviewed |
| Bits, bytes and binary | `cse/cse4ncseunit2/undefined` | Text reviewed (the actual published GitBook page path is `undefined`) |
| ASCII, Unicode and emoji | `cse/cse4ncseunit2/unit2video7` | Text reviewed |
| Database, SQL and Access | `cse/cse4ncseunit2/unit2video8` | Text reviewed |
| Encoding and Python | `cse/cse4ncseunit2/unit2video9` | Text reviewed |
| Unit 2 exercises | `cse/cse4ncseunit2/unit2mcq` | Used for topic coverage only |

The three questions `CSE2-Q002`, `CSE2-Q003`, and `CSE2-Q004` were drafted against the early ICT lesson themes without a full source-text read. **These must be reviewed against the actual lesson text before approval.** No specific historical chronology has been assessed without source confirmation.

## Item quality rules

1. Every item has one defensible correct answer and three plausible but clearly incorrect alternatives.
2. No practice exercise question should be copied word-for-word into the certificate assessment.
3. Limit complexity to foundational understanding with some practical scenarios; do not turn the unit into a specialist SQL or programming examination.
4. Keep consistent terminology across questions and the source lessons. Preserve snippets such as `SELECT`, `WHERE`, `UTF-8`, and `text.encode('utf-8')` as actual code.
5. Examine distractors, possible ambiguity, grammar and technical correctness before publishing.
6. The draft includes the correct answer and explanation for *author review*. Never expose correct answers or explanations in a learner-facing assessment.
7. Include `id`, `topic`, `difficulty`, `question`, `options`, `correctOptionIndex`, `explanation`, and `source` in each question.
8. The 10-question mock exam is a separate deliverable; it should not reveal the final assessment bank answers.

## Critical implementation consideration: trusted assessment results

The current GitHub repository is public. JSON stored here is also publicly readable, including correct answers. The Module 1 browser workflow uses localStorage for registration, attempts and scoring, and the certificate registry accepts browser-submitted data.

Before making Unit 2 certificates publicly available:

- Keep scoring answer keys out of the public client and grade assessment submissions on a trusted service (a suitably secured Apps Script or other backend).
- Record attempts per learner server-side, rather than relying on localStorage for two-attempt enforcement.
- Issue a certificate ID only when the backend verifies the passed attempt.
- Make the verification page resolve the ID against the authoritative registry rather than trusting user-supplied certificate URL parameters.
- Reuse the established certificate visual design, but use module-specific course title, module title and `EHSP-CSE2` identifier.
- Test multiple learners, duplicate registrations, failed attempts, expired sessions and certificate verification.

The public draft JSON is for content review and **must not be used directly for a live credential-bearing assessment**.

## Sequence after author approval

1. Review the 40 original MCQs and verify the three flagged ICT items against the source lessons.
2. Approve final scope and wording (mark question set as reviewed/approved).
3. Create a 10-question practice mock tailored to Unit 2.
4. Build `cse-module-2.html` and links to the correct Unit 2 GitBook lessons.
5. Parameterise/reuse the registration, timed exam, result and certificate code for Module 2, without affecting Module 1.
6. Wire trusted scoring, central attempt records and certificate issuance for Module 2.
7. Perform test learner journeys, then enable the new pathway on the Skill Passport homepage.

## Source materials

- Main course: https://haquenam.gitbook.io/learningwithenam/cse
- Unit 2 outline: https://haquenam.gitbook.io/learningwithenam/cse/cse4ncseunit2/unit2video1
- Data collection: https://haquenam.gitbook.io/learningwithenam/cse/cse4ncseunit2/unit2video6
- Binary: https://haquenam.gitbook.io/learningwithenam/cse/cse4ncseunit2/undefined
- Unicode: https://haquenam.gitbook.io/learningwithenam/cse/cse4ncseunit2/unit2video7
- Database: https://haquenam.gitbook.io/learningwithenam/cse/cse4ncseunit2/unit2video8
- Encoding: https://haquenam.gitbook.io/learningwithenam/cse/cse4ncseunit2/unit2video9
- Practice: https://haquenam.gitbook.io/learningwithenam/cse/cse4ncseunit2/unit2mcq
