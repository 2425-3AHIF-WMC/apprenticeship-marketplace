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

export async function storeRefreshToken(token: string, userId: number): Promise<void> {
    await pool.query("INSERT INTO refresh_tokens (token, company_id) VALUES ($1, $2)", [token, userId]);
}

export async function revokeRefreshToken(token: string): Promise<void> {
    await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [token]);
}

export async function isRefreshTokenValid(token: string): Promise<boolean> {
    const result = await pool.query("SELECT * FROM refresh_tokens WHERE token = $1", [token]);
    return result.rows.length > 0;
}
