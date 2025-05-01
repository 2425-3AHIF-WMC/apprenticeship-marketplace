import express, {Request, Response} from "express";
import {Pool} from "pg";

export const internshipRouter = express.Router();

const pool = new Pool({
    user: "postgres",
    host: "postgres",
    database: "cruddb",
    password: "password",
    port: 5432,
});

internshipRouter.get("/internship/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM internship WHERE id = $1", [id]);
    res.json(result.rows[0]);
});