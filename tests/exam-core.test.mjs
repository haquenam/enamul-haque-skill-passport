import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { prepareExamPaper, scoreExamPaper } from '../src/exam-core.mjs';

const catalogue = JSON.parse(readFileSync(new URL('../assessments/catalogue.json', import.meta.url), 'utf8'));
const assessment = catalogue.assessments[0];
const bank = Object.entries(assessment.topicQuotas).flatMap(([topic, quota]) =>
  Array.from({ length: quota * 2 }, (_, i) => ({
    id: `${topic}-${i}`, topic, question: `Synthetic question ${topic}/${i}`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'], correctOptionIndex: i % 4, active: true
  }))
);
const rng = () => 0.4375;
const now = Date.parse('2026-10-20T12:00:00Z');
const deadlineAt = new Date(now + 25 * 60 * 1000).toISOString();

function make() {
  return prepareExamPaper({assessment, bank, random:rng});
}
function grade(privatePaper, submittedAnswers, overrides = {}) {
  return scoreExamPaper({ assessment, bank, privatePaper, submittedAnswers, deadlineAt, now, ...overrides });
}
function correctAnswers(paper, count = 20) {
  const lookup = new Map(bank.map(q => [q.id, q]));
  return Object.fromEntries(paper.questionIds.slice(0, count).map(id => [id,
    paper.optionOrders[id].indexOf(lookup.get(id).correctOptionIndex)
  ]));
}

test('20 questions, seven quotas, randomised options and no public keys', () => {
  const {privatePaper, publicQuestions} = make();
  assert.equal(publicQuestions.length,20);
  assert.equal(new Set(privatePaper.questionIds).size,20);
  for (const [topic,expected] of Object.entries(assessment.topicQuotas)) {
    assert.equal(privatePaper.questionIds.filter(id => id.startsWith(topic+'-')).length,expected);
  }
  for(const q of publicQuestions) {
    assert.deepEqual(Object.keys(q).sort(), ['id','options','question']);
    assert.equal(q.options.length,4);
    assert.equal('correctOptionIndex' in q,false);
  }
});
test('server-side marks 20/20 PASS, 15/20 PASS, 14/20 FAIL and 0/20 FAIL', () => {
  const {privatePaper}=make();
  for (const [count,expectedPass] of [[20,true],[15,true],[14,false],[0,false]]) {
    const result=grade(privatePaper,correctAnswers(privatePaper,count));
    assert.equal(result.score,count);
    assert.equal(result.passed,expectedPass);
    assert.equal(result.total,20);
  }
});
test('rejects invalid answer values and answers outside exam', () => {
  const {privatePaper}=make();
  assert.throws(() => grade(privatePaper,{[privatePaper.questionIds[0]]:5}),/Invalid submitted/);
  assert.throws(() => grade(privatePaper,{[privatePaper.questionIds[0]]:'1'}),/Invalid submitted/);
  assert.throws(() => grade(privatePaper,{'not-on-this-paper':1}),/outside this exam/);
});
test('server deadline is authoritative and rejects expiry', () => {
  const {privatePaper}=make();
  assert.throws(()=>grade(privatePaper,{}, {now: Date.parse(deadlineAt)}),/deadline has passed/);
});
test('rejects invalid private option order, mismatched assessment and duplicate question IDs', () => {
  const {privatePaper}=make();
  const p1=structuredClone(privatePaper);
  p1.optionOrders[p1.questionIds[0]]=[0,0,1,2];
  assert.throws(()=>grade(p1,{}),/option permutation/);
  const p2=structuredClone(privatePaper);p2.assessmentId='some-other-course';
  assert.throws(()=>grade(p2,{}),/Mismatched/);
  const p3=structuredClone(privatePaper);p3.questionIds[0]=p3.questionIds[1];
  assert.throws(()=>grade(p3,{}),/selected question IDs/);
});
test('insufficient active bank or duplicate private ID fails closed', () => {
  assert.throws(()=>prepareExamPaper({assessment,bank:bank.filter(q=>q.topic!=='ict'),random:rng}),/Insufficient active/);
  assert.throws(()=>prepareExamPaper({assessment,bank:[...bank,bank[0]],random:rng}),/Duplicate/);
});
test('supports independently-configured course final', () => {
  const config={...assessment,id:'ai-integrator-final',questionCount:6,passScore:5,durationMinutes:12,topicQuotas:{intro:2,practice:4}};
  const synthetic=Array.from({length:12},(_,i)=>({id:`AI-${i}`,topic:i<4?'intro':'practice',question:`Synthetic ${i}`,
    options:['A','B','C','D'],correctOptionIndex:0,active:true}));
  const {privatePaper,publicQuestions}=prepareExamPaper({assessment:config,bank:synthetic,random:rng});
  assert.equal(publicQuestions.length,6);
  const answer=Object.fromEntries(privatePaper.questionIds.slice(0,5).map(id=>[id,privatePaper.optionOrders[id].indexOf(0)]));
  const r=scoreExamPaper({assessment:config,bank:synthetic,privatePaper,submittedAnswers:answer,now,deadlineAt});
  assert.equal(r.score,5);assert.equal(r.passed,true);
});
