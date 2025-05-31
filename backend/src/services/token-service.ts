import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function generateAccessToken(payload: object): string {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: "5m" });
}

export function generateRefreshToken(payload: object): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
}

export function generateEmailToken(payload: object): string {
    return jwt.sign(payload, process.env.JWT_EMAIL_SECRET!, { expiresIn: "1h" });
}