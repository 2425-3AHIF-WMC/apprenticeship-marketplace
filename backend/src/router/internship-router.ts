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

internshipRouter.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM internship WHERE id = $1", [id]);
    res.json(result.rows);
});

internshipRouter.get("/", async (req, res) => {
   const result = await pool.query("SELECT * FROM internship");
   res.json(result.rows);
});

internshipRouter.get("/current", async (req, res) => {
    const result = await pool.query("SELECT * FROM internship WHERE application_end > CURRENT_DATE");
    res.json(result.rows);
});

internshipRouter.get("/:internship_id/company", async (req, res) => {
    const { internship_id } = req.params;
    const result = await pool.query("SELECT name FROM company c JOIN site s on(c.company_id = s.company_id) JOIN internship i on(s.location_id = i.location_id) where i.internship_id=$1", [internship_id]);
    res.json(result.rows);
});