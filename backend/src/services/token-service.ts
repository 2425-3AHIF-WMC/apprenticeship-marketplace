import { Pool } from "pg";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool();

export function generateAccessToken(payload: object): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "30m" });
}

export function generateRefreshToken(payload: object): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
}