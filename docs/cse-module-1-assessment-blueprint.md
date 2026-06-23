# CSE Module 1 Assessment Blueprint

## Purpose

This document defines the first assessment blueprint for CSE For Non CSE Students, Module 1. The assessment is designed as a completion assessment for learners who have already watched the related videos, reviewed the GitBook resources, and completed the Unit 1 practice exercise.

## Assessment Positioning

This is a learning recognition assessment. It is not a university degree, formal academic credit, or externally accredited professional qualification. It validates that the learner has completed the learning pathway and has demonstrated basic understanding of the Module 1 topics.

## Source Materials

Primary source material:

1. CSE for Non CSE Students GitBook
2. Unit 1 Computer Science Fundamentals pages
3. Unit 1 Practice Exercise
4. Related YouTube course videos

## MVP Assessment Policy

| Area | Decision |
| --- | --- |
| Course | CSE For Non CSE Students |
| Module | Module 1 |
| Assessment type | Completion assessment |
| Question type | Multiple choice questions |
| Options per question | 4 |
| Questions shown in final exam | 50 questions |
| Time limit | 60 minutes |
| Pass mark | 70 percent |
| Correct answers needed | 35 out of 50 |
| Certificate eligibility | Pass only |
| Question language | Bangla, with common English technical terms where needed |
| Current data file | `data/cse-module-1-questions.json` |

## Attempt And Retake Policy

| Area | Rule |
| --- | --- |
| Mock exam | Unlimited practice attempts |
| Final assessment | Maximum 2 attempts per learner |
| Pass score | 35 out of 50 |
| Certificate issue | Certificate is issued only after passing |
| Retake after first fail | One retake is allowed |
| Retake after pass | No further retake is required |
| After two unsuccessful attempts | Learner should review the learning materials before requesting a manual reset |

Learners may attempt the mock exam as many times as needed for practice. The final Module 1 assessment allows up to two attempts per learner. A certificate is issued only when the learner scores 35 or more out of 50. Once a learner passes, no further retake is required. If both final attempts are unsuccessful, the learner should review the learning materials before requesting another attempt.

For the current MVP, this policy is shown as the official learner guidance. Full technical enforcement will require central attempt tracking through a data capture layer such as Google Sheets, Firebase, Supabase, or another approved backend.

## Topic Coverage Model

| Topic Group | Final Exam Target |
| --- | ---: |
| Course purpose and digital learning context | 4 |
| Computer science foundations | 5 |
| Computer science vs computer engineering | 4 |
| Computer history and generations | 5 |
| Computer architecture and CPU | 6 |
| Input, output, memory, and storage | 6 |
| Software and operating systems | 8 |
| Types and uses of computers | 5 |
| Social media, search engines, and SEO | 5 |
| Gig economy and practical relevance | 2 |
| Total | 50 |

## Difficulty Model

| Difficulty | Target Share | Purpose |
| --- | ---: | --- |
| Easy | 30 percent | Basic recall and confidence building |
| Medium | 50 percent | Understanding and concept distinction |
| Hard | 20 percent | Scenario based reasoning and application |

## Question Data Standard

Each question must include:

| Field | Requirement |
| --- | --- |
| `id` | Unique question ID |
| `topic` | Topic tag |
| `difficulty` | easy, medium, or hard |
| `question` | Question text |
| `options` | Four options |
| `correctOptionIndex` | Zero based index from 0 to 3 |
| `explanation` | Short explanation for learner feedback |
| `source` | GitBook or topic reference |

## Governance Rules

1. The final certificate assessment should not simply copy the practice exercise exactly.
2. The practice questions may be used as a topic and difficulty reference.
3. Every question should have one clearly correct answer.
4. Avoid trick questions in the MVP.
5. Keep language simple and learner friendly.
6. Use familiar Bangla pronunciation for common technical terms when appropriate.
7. Review the full production question set before connecting it to the live exam engine.
8. Keep the final assessment limited to Unit 1 scope.
9. Do not show explanations during the final timed assessment.
10. Show the learner only the result, score, pass status, and certificate eligibility after submission.

## Next Delivery Steps

| Step | Output |
| --- | --- |
| 1 | Production 50 question assessment set approved |
| 2 | Registration page created |
| 3 | Timed exam page created |
| 4 | Scoring result page created |
| 5 | Attempt and retake policy documented |
| 6 | Build certificate generation |
| 7 | Build certificate verification |
| 8 | Add central attempt tracking when backend is introduced |
