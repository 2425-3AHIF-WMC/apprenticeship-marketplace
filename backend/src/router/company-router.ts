import express, {Request, Response} from "express";
import {ICompany, ICompanySmall} from "../model";
import {StatusCodes} from "http-status-codes";
import jwt, {JwtPayload} from "jsonwebtoken";
import {generateAccessToken, generateRefreshToken,} from "../services/token-service.js";
import dotenv from "dotenv";
import argon2 from '@node-rs/argon2';
import {Unit} from "../unit.js";
import {CompanyService} from "../services/company-service.js";

dotenv.config();

export const companyRouter = express.Router();

companyRouter.get("/", async (req: Request, res: Response) => {
    const unit: Unit = await Unit.create(true);

    try {
        const service = new CompanyService(unit);
        const companies: ICompany[] = await service.getAll();
        res.status(StatusCodes.OK).json(companies);
    } catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});

companyRouter.get("/me", async (req: Request, res: Response) => {
    const unit: Unit = await Unit.create(true);

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({error: "No token"});
        return;
    }
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
        try {
            const service = new CompanyService(unit);
            const companySmall: ICompanySmall | null = await service.getByIdSmall(decoded.company_id);
            if (companySmall) {
                res.status(StatusCodes.OK).json(companySmall);
            } else {
                res.sendStatus(StatusCodes.NOT_FOUND);
                return;
            }
        } catch (e) {
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        } finally {
            await unit.complete();
        }
    } catch (err) {
        res.status(StatusCodes.UNAUTHORIZED).json({error: "Invalid token"});
    }
});

companyRouter.post("/login", async (req: Request, res: Response) => {
    const unit: Unit = await Unit.create(true);
    const {email, password} = req.body;

    try {
        const service = new CompanyService(unit);
        const company: ICompany | null = await service.getByEmail(email);

        if (company) {
            res.status(StatusCodes.OK).json(company);

            const isMatch: boolean = await argon2.verify(company.password, password);
            if (isMatch) {
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
                    secure: false, // für Testzwecke; wird später geändert
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
                    .header('Authorization', `Bearer ${newAccessToken}`)
                    .status(StatusCodes.OK)
                    .json({accessToken: newAccessToken});
            } else {
                res.sendStatus(StatusCodes.UNAUTHORIZED);
            }
        } else {
            res.sendStatus(StatusCodes.NOT_FOUND);
            // Lukas wollte hier 401 schicken, wenn result.rows.length im service 0 gewesen wäre, weiß nicht wieso
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});

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

companyRouter.get("/unverified_admin", async (_, res: Response) => {
    const unit: Unit = await Unit.create(true);

    try {
        const service = new CompanyService(unit);
        const companies: ICompany[] = await service.getByUnverifiedAdmin();
        console.log(companies);

        if(companies.length > 0) {
            res.status(StatusCodes.OK).json(companies);
        } else {
            res.sendStatus(StatusCodes.NOT_FOUND);
        }
    } catch(e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});

companyRouter.get("/:paramId", async (req: Request, res: Response) => {
    const unit: Unit = await Unit.create(true);
    const {paramId} = req.params;
    const id: number = parseInt(paramId);

    if (isNaN(id) || id <= 0 || id === null) {
        res.status(StatusCodes.BAD_REQUEST).send("Invalid id");
        return;
    }

    try {
        const service = new CompanyService(unit);
        const company: ICompany | null = await service.getById(id);

        if (company) {
            res.status(StatusCodes.OK).json(company);
        } else {
            res.sendStatus(StatusCodes.NOT_FOUND);
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});


