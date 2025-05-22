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


    const unit: Unit = await Unit.create(true);
    const {email, password} = req.body;

    try {
        const service = new CompanyService(unit);
        const company: ICompany | null = await service.getByEmail(email);


        if (company) {
            res.status(StatusCodes.OK).json(company);


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
        const hashedPassword = await argon2.hash(password, {
            algorithm: argon2.Algorithm.Argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 2,
        });

        const timestampInSeconds = Date.now() / 1000;
        const insertResult  = await  pool.query(`
            INSERT INTO COMPANY(name, company_number, website, email, phone_number, password, email_verified, admin_verified, company_registration_timestamp)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, to_timestamp($9)) 
            RETURNING company_id, admin_verified, email_verified`,
            [name, companyNumber, website, email, phoneNumber, hashedPassword, false, false, timestampInSeconds]);

        const company : ICompanyPayload = insertResult.rows[0];

        const payload = {
            company_id: company.company_id,
            admin_verified: company.admin_verified,
            email_verified: company.email_verified,
        };

        const newAccessToken = generateAccessToken(payload);
        const newRefreshToken = generateRefreshToken(payload);

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
            .header('Authorization', `Bearer ${newAccessToken}`)
            .status(201)
            .json({accessToken: newAccessToken});
    } catch (err) {
        console.log(err);
        res.status(500).json({Error: err})

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

        if (companies.length > 0) {
            res.status(StatusCodes.OK).json(companies);
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

companyRouter.get("/:param_id", async (req: Request, res: Response) => {
    const unit: Unit = await Unit.create(true);
    const {param_id} = req.params;
    const id: number = parseInt(param_id);

    if (!isValidId(id)) {
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

companyRouter.put("", async (req: Request, res: Response) => {
    const company: ICompany = {
        company_id: parseInt(req.body.company_id),
        name: req.body.name,
        company_number: req.body.company_number,
        company_info: req.body.company_info,
        website: req.body.website,
        email: req.body.email,
        phone_number: req.body.phone_number,
        password: req.body.password,
        email_verified: req.body.email_verified,
        admin_verified: req.body.admin_verified,
        company_registration_timestamp: new Date(req.body.company_registration_timestamp),
        email_verification_timestamp: req.body.email_verification_timestamp
            ? new Date(req.body.email_verification_timestamp)
            : null,
        admin_verification_timestamp: req.body.admin_verification_timestamp
            ? new Date(req.body.admin_verification_timestamp)
            : null
    };
    const unit: Unit = await Unit.create(false);

    console.log(company);

    try {
        const service = new CompanyService(unit);
        const companyExists: boolean = await service.getByIdSmall(company.company_id) ? true : false;
        const validWebsite: boolean = company.website.substring(0, 8) === "https://";
        const validEmail: boolean = company.email.includes('@');
        const allowedBooleanString: string[] = ['true', 't', 'y', 'yes', '1', 'false', 'f', 'n', 'no', '0'];
        const validVerifications: boolean = allowedBooleanString.includes(company.email_verified.toLowerCase()) && allowedBooleanString.includes(company.admin_verified.toLowerCase());

        if (validWebsite && validEmail && validVerifications
            && isValidId(company.company_id) && isValidCompanyNumber(company.company_number)
            && isValidDate(company.company_registration_timestamp)
            && (company.email_verification_timestamp ? isValidDate(company.email_verification_timestamp) : true) && (company.admin_verification_timestamp ? isValidDate(company.admin_verification_timestamp) : true)) { // some complex validation, because these timestamps can be null
            const success: boolean = await (companyExists ? service.update(company) : service.insert(company));

            if (success) {
                await unit.complete(true);
                res.status(companyExists ? StatusCodes.NO_CONTENT : StatusCodes.CREATED).json(company)
            } else {
                await unit.complete(false);
                res.status(StatusCodes.BAD_REQUEST).send("updating or creating was not successful");
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).send("verification failed");
        }

    } catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete(false);
    }
});

function isValidId(id: number): boolean {
    return !isNaN(id) && id > 0 && id !== null && id !== undefined;
}

function isValidDate(date: Date): boolean {
    return date.toString() !== 'Invalid Date';
}

function isValidCompanyNumber(number: string): boolean {
    const nums: number = parseInt(number.substring(0, 6));
    const letter: number = parseInt(number.substring(6));

    return !isNaN(nums) && isNaN(letter);
}


