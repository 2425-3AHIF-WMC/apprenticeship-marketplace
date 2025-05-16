import express, {Request, Response} from "express";
import {Pool} from "pg";
import {Unit} from "../unit";
import {StudentService} from "../services/student-service";
import {ICompany, IStudent} from "../model";
import {StatusCodes} from "http-status-codes";
import jwt, {JwtPayload, VerifyErrors} from "jsonwebtoken";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../services/token-service.js";
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
})

companyRouter.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM company WHERE id = $1", [id]);
    res.json(result.rows);
});

companyRouter.get("/me", async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "No token" });
        return;
    }
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
        const result = await pool.query("select company_id, name, email FROM company WHERE company_id = $1", [decoded.company_id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Company not found" });
            return;
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
});


companyRouter.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;
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
        // Acesstoken & Refreshtoken erstellen
        const payload = {
            company_id:company.company_id,
            admin_verified:company.admin_verified,
            email_verified:company.email_verified        }
        const newAccessToken= generateAccessToken(payload);
        const newRefreshToken = generateRefreshToken(payload);

        res.status(StatusCodes.OK).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
        return;
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
})

companyRouter.post("/refresh", async (req: Request, res: Response) => {
    const { refreshToken }  = req.body;

    if (!refreshToken) {
        res.status(401).json("No refresh token");
        return;
    }

    try {
        const decoded : JwtPayload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as JwtPayload;

        const newAccessToken = generateAccessToken({
            company_id: decoded.company_id,
            admin_verified: decoded.admin_verified,
            email_verified: decoded.email_verified
        });

        res.status(200).json({accessToken: newAccessToken});
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});


companyRouter.get("/verify", (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "No token" });
        return;
    }

    const token = authHeader.split(" ")[1]; // to get the part after Bearer

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
        res.status(200).json({ valid: true, decoded });
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
    }
});