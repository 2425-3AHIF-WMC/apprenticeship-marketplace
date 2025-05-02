import {Request, Response} from 'express';
import {internshipRouter} from "./router/internship-router";
import {companyRouter} from "./router/company-router";
import {studentRouter} from "./router/student-router";
import {ensureTablesCreated} from "./unit";

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

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

app.listen(5000, () => {
    console.log("Server running on port 5000");
});