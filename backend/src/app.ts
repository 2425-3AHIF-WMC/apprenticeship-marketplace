import {internshipRouter} from "./router/internship-router.js";
import {companyRouter} from "./router/company-router.js";
import {studentRouter} from "./router/student-router.js";
import {ensureTablesCreated} from "./unit.js";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Pool } from "pg";

const app = express();
const pool = new Pool({
    user: "postgres",
    host: "postgres",
    database: "cruddb",
    password: "password",
    port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

app.use("api/student", studentRouter);
app.use("api/internship", internshipRouter);
app.use("api/company", companyRouter);

app.listen(5000, async () => {
    console.log("Server running on port 5000");
    await ensureTablesCreated();
});