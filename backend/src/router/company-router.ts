import express, {Request, Response} from "express";
import {Pool} from "pg";
import {ICompany} from "../model";
import {StatusCodes} from "http-status-codes";
import jwt, {JwtPayload} from "jsonwebtoken";
import {generateAccessToken, generateRefreshToken,} from "../services/token-service.js";
import dotenv from "dotenv";
import argon2 from '@node-rs/argon2';

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

companyRouter.get("/me", async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({error: "No token"});
        return;
    }
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
        const result = await pool.query("select company_id, name, email FROM company WHERE company_id = $1", [decoded.company_id]);
        if (result.rows.length === 0) {
            res.status(404).json({error: "Company not found"});
            return;
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(401).json({error: "Invalid token"});
    }
});


companyRouter.post("/login", async (req: Request, res: Response) => {
    const {email, password} = req.body;
    try {
        const result = await pool.query(
            `SELECT c.*
             FROM company c
             WHERE c.email = $1`,
            [email]
        );
        const company: ICompany = result.rows[0];

        if (result.rows.length === 0) {
            res.status(401).json("E-Mail or password incorrect");
            return;
        }

        const isMatch = await argon2.verify(company.password, password);
        if (!isMatch) {
            res.status(401).json("E-Mail or password incorrect");
            return
        }

        // Acesstoken & Refreshtoken erstellen
        const payload = {
            company_id: company.company_id,
            admin_verified: company.admin_verified,
            email_verified: company.email_verified
        }
        const newAccessToken = generateAccessToken(payload);
        const newRefreshToken = generateRefreshToken(payload);

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: false, // for testing purposes, changing later
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
            .header('Authorization', `Bearer ${newAccessToken}`)
            .status(StatusCodes.OK)
            .json({accessToken: newAccessToken});
        return;
    } catch (err) {
        res.status(500).json({error: err});
    }
});

companyRouter.post("/register", async (req: Request, res: Response) => {
    const {name, companyNumber, email, phoneNumber, website, password} = req.body;
    try {
        const result = await pool.query(
            `SELECT c.*
             FROM company c
             WHERE c.email = $1`,
            [email]
        );

        if (result.rows.length != 0) {
            res.status(409).json({error: "E-Mail is already in Use"});
            return;
        }

        await pool.query(`
            INSERT INTO COMPANY(name, website, email, phone_number, password, email_verified, admin_verified)
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [name, website, email, phoneNumber, password, false, false]);

        res.status(200).send('Company created');
    } catch (err) {
        res.status(500).json({Error: err})
    }
})

companyRouter.post("/refresh", async (req: Request, res: Response) => {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
        res.status(401).json("No refresh token");
        return;
    }

    try {
        const decoded: JwtPayload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as JwtPayload;

        const newAccessToken = generateAccessToken({
            company_id: decoded.company_id,
            admin_verified: decoded.admin_verified,
            email_verified: decoded.email_verified
        });

        res.header('Authorization', `Bearer ${newAccessToken}`)
            .status(200)
            .json({accessToken: newAccessToken})
    } catch (err) {
        res.status(500).json({error: "Internal server error"});
    }
});


companyRouter.get("/verify", (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({error: "No token"});
        return;
    }

    const token = authHeader.split(" ")[1]; // to get the part after Bearer

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
        res.status(200).json({valid: true, decoded});
    } catch (err) {
        res.status(400).json({error: "Invalid token"});
    }
});

companyRouter.post("/logout", (req: Request, res: Response) => {
    try {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: false,
            maxAge: 0
        });
        res.status(200).json({message: "Logged out"});
    } catch (err) {
        res.status(500).json({error: err});
    }
});

/*
companyRouter.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM company WHERE company_id = $1", [id]);
    res.json(result.rows);
});
*/