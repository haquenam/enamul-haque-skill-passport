# CSE Module 1 Assessment Blueprint

## Purpose

This document defines the first assessment blueprint for CSC For Non CSC Students, Module 1. The assessment is designed as a completion assessment for learners who have already watched the related videos, reviewed the GitBook resources, and completed the Unit 1 practice exercise.

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
| Course | CSC For Non CSC Students |
| Module | Module 1 |
| Assessment type | Completion assessment |
| Question type | Multiple choice questions |
| Options per question | 4 |
| Target question bank size | 100 questions |
| Initial starter bank size | 20 questions |
| Questions shown in final exam | 50 questions |
| Time limit | 60 minutes |
| Pass mark | 70 percent |
| Certificate eligibility | Pass only |
| Question language | Bangla, with common English technical terms where needed |
| Current data file | `data/cse-module-1-questions.json` |

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
7. Review the full 100 question bank before connecting it to the live exam engine.

## Next Delivery Steps

| Step | Output |
| --- | --- |
| 1 | Starter 20 question bank created |
| 2 | Review questions for accuracy and tone |
| 3 | Expand bank to 100 questions |
| 4 | Build registration page |
| 5 | Build timed exam page |
| 6 | Build scoring result page |
| 7 | Build certificate generation and verification |
