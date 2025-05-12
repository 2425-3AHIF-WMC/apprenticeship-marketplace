import express, {Request, Response} from "express";
import {Pool} from "pg";

export const companyRouter = express.Router();

const pool = new Pool({
    user: "postgres",
    host: "postgres",
    database: "cruddb",
    password: "postgres",
    port: 5432,
});

companyRouter.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM company WHERE id = $1", [id]);
    res.json(result.rows);
});

