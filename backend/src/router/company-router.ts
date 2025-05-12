import express, {Request, Response} from "express";
import {Pool} from "pg";
import {Unit} from "../unit";
import {StudentService} from "../services/student-service";
import {IStudent} from "../model";
import {StatusCodes} from "http-status-codes";

export const companyRouter = express.Router();

const pool = new Pool({
    user: "postgres",
    host: "postgres",
    database: "cruddb",
    password: "postgres",
    port: 5432,
});

companyRouter.get("/", async (req: Request, res: Response) => {
    const result = await pool.query("SELECT * FROM company");
    res.json(result.rows);
})

companyRouter.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM company WHERE id = $1", [id]);
    res.json(result.rows);
});

companyRouter.post("/login", async (req:Request, res: Response) => {
    const {email,password} = req.body;
    try {
        const result = await pool.query(
            `SELECT c.*
             FROM company c
             WHERE c.email = $1 AND c.password = $2`,
            [email, password]
        );

        if (result.rows.length === 0) {
            res.status(401).json("E-Mail or password incorrect");
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
})

