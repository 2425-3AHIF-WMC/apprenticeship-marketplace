import {internshipRouter} from "./router/internship-router.js";
import {companyRouter} from "./router/company-router.js";
import {studentRouter} from "./router/student-router.js";
import {Unit, insertSampleData, ensureTablesCreated} from "./unit.js";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/student", studentRouter);
app.use("/api/internship", internshipRouter);
app.use("/api/company", companyRouter);

app.listen(5000, async () => {
    const unit: Unit = await Unit.create(false);
    await insertSampleData(unit);
    await unit.complete(true);
    console.log("Server running on port 5000");
    // await ensureTablesCreated(); // sollte eigentlich nicht hier passieren, sondern in der Unit
});