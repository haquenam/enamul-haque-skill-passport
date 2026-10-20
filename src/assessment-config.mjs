/** EHSP shared configuration validator; contains no assessment keys or learner records. */
export function validateCatalogue(input){
 const errors=[];
 const obj=v=>v!==null&&typeof v==="object"&&!Array.isArray(v);
 const valid=s=>typeof s==="string"&&!!s.trim();
 const integer=n=>Number.isInteger(n)&&n>0;
 const allowed=(v,fields,p)=>{if(obj(v))for(const k of Object.keys(v))if(!fields.includes(k))errors.push(`${p}: disallowed field ${k}`)};
 if(!obj(input))return ["Catalogue must be an object"];
 allowed(input,["schemaVersion","purpose","courses","assessments"],"catalogue");
 if(input.schemaVersion!==1)errors.push("schemaVersion must be 1");
 if(!Array.isArray(input.courses)||!Array.isArray(input.assessments))return [...errors,"courses and assessments must be arrays"];
 const seenCourses=new Set(),seenAssessments=new Set();
 for(const [i,c] of input.courses.entries()){
  const p=`courses[${i}]`;if(!obj(c)){errors.push(`${p}: not object`);continue}
  allowed(c,["id","title","model","status","learningUrl"],p);
  if(!valid(c.id)||seenCourses.has(c.id))errors.push(`${p}: invalid or duplicate id`); else seenCourses.add(c.id);
  if(!valid(c.title))errors.push(`${p}: missing title`);
  if(!["unit","course"].includes(c.model))errors.push(`${p}: invalid model`);
  if(!["PLANNED","IN_PROGRESS","PUBLISHED"].includes(c.status))errors.push(`${p}: invalid status`);
  if(c.learningUrl!==null&&!(valid(c.learningUrl)&&c.learningUrl.startsWith("https://")))errors.push(`${p}: learningUrl must be HTTPS or null`);
 }
 for(const [i,a] of input.assessments.entries()){
  const p=`assessments[${i}]`;if(!obj(a)){errors.push(`${p}: not object`);continue}
  allowed(a,["id","courseId","unitId","title","model","releaseStatus","questionBankStatus","bankSize","questionCount","durationMinutes","passPercentage","passScore","maxAttempts","authSessionMinutes","topicQuotas","certificateTitle","certificateIdPrefix"],p);
  if(!valid(a.id)||seenAssessments.has(a.id))errors.push(`${p}: invalid or duplicate id`); else seenAssessments.add(a.id);
  const c=input.courses.find(c=>obj(c)&&c.id===a.courseId);
  if(!c)errors.push(`${p}: missing course reference`);
  if(!valid(a.title)||!valid(a.certificateTitle)||!valid(a.certificateIdPrefix))errors.push(`${p}: missing assessment/certificate title or ID prefix`);
  if(!["unit","course"].includes(a.model)||(c&&a.model!==c.model))errors.push(`${p}: assessment model mismatch`);
  if(a.model==="unit"&&!valid(a.unitId)||a.model==="course"&&a.unitId!==null)errors.push(`${p}: invalid unitId for model`);
  if(!["SETUP_ONLY","PUBLISHED","RETIRED"].includes(a.releaseStatus))errors.push(`${p}: invalid releaseStatus`);
  if(!["PRIVATE_DRAFT_INACTIVE_REVIEW_REQUIRED","APPROVED_ACTIVE"].includes(a.questionBankStatus))errors.push(`${p}: invalid questionBankStatus`);
  if(a.releaseStatus==="PUBLISHED"&&a.questionBankStatus!=="APPROVED_ACTIVE")errors.push(`${p}: unpublished/unapproved bank cannot be released`);
  for(const k of ["bankSize","questionCount","durationMinutes","passScore","maxAttempts","authSessionMinutes"])if(!integer(a[k]))errors.push(`${p}: invalid ${k}`);
  if(!Number.isInteger(a.passPercentage)||a.passPercentage<1||a.passPercentage>100)errors.push(`${p}: invalid passPercentage`);
  if(integer(a.bankSize)&&integer(a.questionCount)&&a.bankSize<a.questionCount)errors.push(`${p}: bank too small`);
  if(integer(a.questionCount)&&integer(a.passScore)&&a.passScore>a.questionCount)errors.push(`${p}: passScore too high`);
  if(integer(a.questionCount)&&integer(a.passScore)&&Number.isInteger(a.passPercentage)&&Math.ceil(a.questionCount*a.passPercentage/100)!==a.passScore)errors.push(`${p}: passScore and passPercentage inconsistent`);
  if(!obj(a.topicQuotas)||!Object.keys(a.topicQuotas).length)errors.push(`${p}: missing topicQuotas`);
  else{
   if(Object.entries(a.topicQuotas).some(([key,v])=>!valid(key)||!integer(v)))errors.push(`${p}: invalid topicQuotas`);
   if(Object.values(a.topicQuotas).reduce((s,n)=>s+(typeof n==="number"?n:0),0)!==a.questionCount)errors.push(`${p}: topic quotas do not total questionCount`);
  }
 }
 return errors;
}
