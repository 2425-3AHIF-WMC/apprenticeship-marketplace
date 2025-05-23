import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function generateAccessToken(payload: object): string {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: "30m" });
}

export function generateRefreshToken(payload: object): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
}