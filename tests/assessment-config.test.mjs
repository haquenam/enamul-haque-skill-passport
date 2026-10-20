import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateCatalogue} from "../src/assessment-config.mjs";
const data=JSON.parse(readFileSync(new URL("../assessments/catalogue.json",import.meta.url),"utf8"));
const copy=()=>structuredClone(data);
test("approved Unit 2 values and inactive release validate",()=>{
 assert.deepEqual(validateCatalogue(copy()),[]);
 const u=data.assessments[0];
 assert.equal(u.questionCount,20);assert.equal(u.bankSize,40);
 assert.equal(u.durationMinutes,25);assert.equal(u.passScore,15);
 assert.equal(u.maxAttempts,2);assert.equal(u.releaseStatus,"SETUP_ONLY");
});
test("topic-quota changes cannot silently alter count",()=>{
 const x=copy();x.assessments[0].topicQuotas.binary=4;
 assert.ok(validateCatalogue(x).some(e=>e.includes("topic quotas do not total")));
});
test("draft bank cannot be published",()=>{
 const x=copy();x.assessments[0].releaseStatus="PUBLISHED";
 assert.ok(validateCatalogue(x).some(e=>e.includes("cannot be released")));
});
test("passing score must match percent",()=>{
 const x=copy();x.assessments[0].passScore=14;
 assert.ok(validateCatalogue(x).some(e=>e.includes("inconsistent")));
});
test("public catalogue rejects answer key fields",()=>{
 const x=copy();x.assessments[0].correctOptionIndex=2;
 assert.ok(validateCatalogue(x).some(e=>e.includes("disallowed field correctOptionIndex")));
});
test("unknown course cannot be selected",()=>{
 const x=copy();x.assessments[0].courseId="missing";
 assert.ok(validateCatalogue(x).some(e=>e.includes("missing course reference")));
});
test("configuration can represent a course final without new backend code",()=>{
 const x=copy();
 x.assessments.push({...x.assessments[0],id:"EXAMPLE-ONLY",courseId:"ai-integrator",unitId:null,model:"course",certificateIdPrefix:"EXAMPLE"});
 assert.deepEqual(validateCatalogue(x),[]);
});
