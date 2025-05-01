import {Request, Response} from 'express';
import {companyRouter} from './routers/company-router';
import {studentRouter} from "./routers/student-router";
import {internshipRouter} from "./routers/internship-router";

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

app.use("/api/company", companyRouter);
app.use("/api/student", studentRouter);
app.use("/api/internship", internshipRouter);

// NOTE: temporary code, so we can see how it will look like
// CREATE
app.post("/items", async (req: Request, res: Response) => {
    const { name } = req.body;
    const result = await pool.query("INSERT INTO items (name) VALUES ($1) RETURNING *", [name]);
    res.json(result.rows[0]);
});

// READ
app.get("/items", async (req: Request, res: Response) => {
    const result = await pool.query("SELECT * FROM items");
    res.json(result.rows);
});

// UPDATE
app.put("/items/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    const result = await pool.query("UPDATE items SET name = $1 WHERE id = $2 RETURNING *", [name, id]);
    res.json(result.rows[0]);
});

// DELETE
app.delete("/items/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    await pool.query("DELETE FROM items WHERE id = $1", [id]);
    res.json({ message: "Item deleted" });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});