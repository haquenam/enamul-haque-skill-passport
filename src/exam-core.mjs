/**
 * EHSP assessment core v0.1: pure functions adapted from the Unit 2
 * ExamEngine.js selection and ExamScoring.js grading algorithms.
 *
 * This is server-side library code, NOT an API route. It never obtains
 * authentication, scores, timing or question banks from an untrusted browser.
 * Credential issuance and spreadsheet writes are deliberately outside scope.
 * Keep real private question banks and answer keys out of public repositories.
 */

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function shuffle(items, random) {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const r = random();
    assert(Number.isFinite(r) && r >= 0 && r < 1, 'Invalid server random source.');
    const j = Math.floor(r * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function validateAssessmentPolicy(assessment) {
  assert(isRecord(assessment), 'Invalid assessment policy.');
  assert(typeof assessment.id === 'string' && assessment.id.length > 0, 'Missing assessment ID.');
  assert(Number.isInteger(assessment.questionCount) && assessment.questionCount > 0, 'Invalid question count.');
  assert(Number.isInteger(assessment.passScore) && assessment.passScore > 0 && assessment.passScore <= assessment.questionCount, 'Invalid passing score.');
  assert(Number.isInteger(assessment.durationMinutes) && assessment.durationMinutes > 0, 'Invalid duration.');
  assert(isRecord(assessment.topicQuotas) && Object.keys(assessment.topicQuotas).length > 0, 'Missing topic quotas.');
  assert(Object.values(assessment.topicQuotas).every(v => Number.isInteger(v) && v > 0), 'Invalid topic quota.');
  assert(Object.values(assessment.topicQuotas).reduce((a, b) => a + b, 0) === assessment.questionCount, 'Topic quotas do not sum to question count.');
}

function validateBank(bank) {
  assert(Array.isArray(bank), 'Private question bank required.');
  const ids = new Set();
  for (const q of bank) {
    assert(isRecord(q) && typeof q.id === 'string' && q.id.length > 0 && !ids.has(q.id), 'Duplicate or invalid private question ID.');
    ids.add(q.id);
    assert(typeof q.topic === 'string' && q.topic.length > 0, 'Invalid question topic.');
    assert(typeof q.question === 'string' && q.question.trim().length > 0, 'Empty question.');
    assert(Array.isArray(q.options) && q.options.length === 4 && q.options.every(s => typeof s === 'string' && s.trim().length > 0), 'Invalid question options.');
    assert(Number.isInteger(q.correctOptionIndex) && q.correctOptionIndex >= 0 && q.correctOptionIndex < 4, 'Invalid private answer key.');
  }
}

/**
 * Called by a trusted server only, after authentication and release checks.
 * Returns separate objects: store privatePaper under server control; send only
 * publicQuestions to the learner. NEVER send privatePaper or private bank.
 */
export function prepareExamPaper({ assessment, bank, random = Math.random }) {
  validateAssessmentPolicy(assessment);
  validateBank(bank);
  assert(typeof random === 'function', 'Invalid server random source.');

  const selected = [];
  const available = bank.filter(q => q.active === true);
  for (const [topic, required] of Object.entries(assessment.topicQuotas)) {
    const matches = available.filter(q => q.topic === topic);
    assert(matches.length >= required, `Insufficient active questions for topic: ${topic}.`);
    selected.push(...shuffle(matches, random).slice(0, required));
  }
  const picked = shuffle(selected, random);
  assert(picked.length === assessment.questionCount && new Set(picked.map(q => q.id)).size === picked.length,
    'Invalid question selection.');

  const optionOrders = Object.create(null);
  const publicQuestions = picked.map(q => {
    const order = shuffle([0, 1, 2, 3], random);
    optionOrders[q.id] = order;
    return { id: q.id, question: q.question, options: order.map(idx => q.options[idx]) };
  });
  return {
    privatePaper: { assessmentId: assessment.id, questionIds: picked.map(q => q.id), optionOrders },
    publicQuestions
  };
}

/**
 * Called only by a trusted server with an authenticated, authorised session,
 * server-stored privatePaper, server timestamp and server-stored deadline.
 * Caller must use a lock and idempotent persistence before issuing credentials.
 */
export function scoreExamPaper({ assessment, bank, privatePaper, submittedAnswers, deadlineAt, now = Date.now() }) {
  validateAssessmentPolicy(assessment);
  validateBank(bank);
  assert(isRecord(privatePaper) && privatePaper.assessmentId === assessment.id, 'Mismatched examination session.');
  assert(Number.isFinite(now), 'Invalid server clock.');
  const deadline = new Date(deadlineAt).getTime();
  assert(Number.isFinite(deadline), 'Invalid server deadline.');
  assert(now < deadline, 'Examination deadline has passed.');
  assert(isRecord(submittedAnswers), 'Invalid answer submission.');

  const ids = privatePaper.questionIds;
  assert(Array.isArray(ids) && ids.length === assessment.questionCount && new Set(ids).size === ids.length,
    'Invalid selected question IDs.');
  assert(isRecord(privatePaper.optionOrders), 'Invalid option orders.');
  const allowed = new Set(ids);
  for (const id of Object.keys(submittedAnswers)) {
    assert(allowed.has(id), 'An answer references a question outside this exam.');
  }
  const lookup = new Map(bank.map(q => [q.id, q]));
  let score = 0;
  let answered = 0;
  const normalisedAnswers = Object.create(null);
  for (const id of ids) {
    const q = lookup.get(id);
    const order = privatePaper.optionOrders[id];
    assert(q, 'Selected question is missing from private bank.');
    assert(Array.isArray(order) && order.length === 4 && new Set(order).size === 4 && order.every(n => Number.isInteger(n) && n >= 0 && n <= 3),
      'Invalid stored option permutation.');
    if (!Object.prototype.hasOwnProperty.call(submittedAnswers, id) || submittedAnswers[id] === null) continue;
    const shownOption = submittedAnswers[id];
    assert(Number.isInteger(shownOption) && shownOption >= 0 && shownOption <= 3, 'Invalid submitted answer option.');
    answered++;
    normalisedAnswers[id] = shownOption;
    if (order[shownOption] === q.correctOptionIndex) score++;
  }
  return {
    assessmentId: assessment.id,
    score,
    total: assessment.questionCount,
    answered,
    passed: score >= assessment.passScore,
    normalisedAnswers
  };
}
