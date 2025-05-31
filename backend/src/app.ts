import {internshipRouter} from "./router/internship-router.js";
import {companyRouter} from "./router/company-router.js";
import {studentRouter} from "./router/student-router.js";
import {standardRouter} from "./router/standard-router.js";
import {Unit, insertSampleData, ensureTablesCreated} from "./unit.js";
import cookieParser from 'cookie-parser';
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {favouriteRouter} from "./router/favourite-router.js";
import { mediaRouter } from "./router/media-router.js";

const app = express();

app.use(cors({
    origin: 'http://localhost:8081',
    credentials: true,
    exposedHeaders: ['Authorization']
}));

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

app.use("/api", standardRouter);
app.use("/api/student", studentRouter);
app.use("/api/internship", internshipRouter);
app.use("/api/company", companyRouter);
app.use("/api/favourite", favouriteRouter);
app.use("/api/media", mediaRouter);


app.listen(5000, async () => {
    const unit: Unit = await Unit.create(false);
    await insertSampleData(unit);
    await unit.complete(true);
    console.log("Server running on port 5000");
    // await ensureTablesCreated(); // sollte eigentlich nicht hier passieren, sondern in der Unit
});