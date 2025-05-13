import express, {Request, Response} from "express";
import {Pool} from "pg";
import {Unit} from "../unit";
import {StudentService} from "../services/student-service";
import {ICompany, IStudent} from "../model";
import {StatusCodes} from "http-status-codes";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

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
    console.log("CLEAR \r\n\r\n\r\n\r\n")
    console.clear();
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
            return;
        }
        const company : ICompany = result.rows[0];
        // Acesstoken erstellen

        const accessToken = jwt.sign({
            company_id:company.company_id,
            admin_verified:company.admin_verified,
            email_verified:company.email_verified
        }, process.env.JWT_SECRET!)
        res.json({
            company:company.email,
            admin_verified:company.admin_verified,
            email_verified:company.email_verified,
            accessToken
        });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
})

