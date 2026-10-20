import {readFileSync} from "node:fs";
import {validateCatalogue} from "../src/assessment-config.mjs";
const data=JSON.parse(readFileSync(new URL("../assessments/catalogue.json",import.meta.url),"utf8"));
const errors=validateCatalogue(data);
if(errors.length){for(const error of errors)console.error("FAIL:",error);process.exitCode=1;}
else console.log("PASS: "+data.courses.length+" courses, "+data.assessments.length+" configured assessment; release gates valid.");
