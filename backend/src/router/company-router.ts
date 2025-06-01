import express, {Request, Response} from "express";
import {
    ICompany,
    ICompanySmall,
    IInternship,
    IInternshipId,
    IInternshipUIProps,
    isValidId,
    isValidDate,
    ISite, ICompanyPayload
} from "../model.js";
import {StatusCodes} from "http-status-codes";
import jwt, {JwtPayload} from "jsonwebtoken";
import {
    generateAccessToken,
    generateEmailToken,
    generatePasswordResetToken,
    generateRefreshToken,
} from "../services/token-service.js";
import dotenv from "dotenv";
import argon2 from '@node-rs/argon2';
import {Unit} from "../unit.js";
import {CompanyService} from "../services/company-service.js";
import {InternshipService} from "../services/internship-service.js";
import {SiteService} from "../services/site-service.js";
import {Pool} from "pg";

dotenv.config();

const pool = new Pool({
    user: "postgres",
    host: "postgres",
    database: "cruddb",
    password: "postgres",
    port: 5432,
});


export const companyRouter = express.Router();
const allowedBooleanStrings: string[] = ['true', 't', 'y', 'yes', '1', 'false', 'f', 'n', 'no', '0'];
const allowedBooleanTrueStrings: string[] = ['true', 't', 'y', 'yes', '1'];
const allowedBooleanFalseStrings: string[] = ['false', 'f', 'n', 'no', '0'];

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

            const isMatch: boolean = await argon2.verify(company.password, password);
            if (isMatch) {
                const emailVerified = Boolean(company.email_verified)
                if (!emailVerified) {
                    res.status(StatusCodes.FORBIDDEN).json("Email not verified");
                    return;
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

companyRouter.post("/register", async (req: Request, res: Response) => {
    const unit: Unit = await Unit.create(true);
    const {name, companyNumber, email, phoneNumber, website, password} = req.body;
    try {
        const service = new CompanyService(unit);
        const emailExists: ICompany | null = await service.getByEmail(email);
        if (emailExists) {
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
        const insertResult = await pool.query(`
                    INSERT INTO COMPANY(name, company_number, website, email, phone_number, password, email_verified,
                                        admin_verified, company_registration_timestamp)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, to_timestamp($9))
                    RETURNING company_id, admin_verified, email_verified`,
            [name, companyNumber, website, email, phoneNumber, hashedPassword, false, false, timestampInSeconds]);

        const company: ICompanyPayload = insertResult.rows[0];
        const payload = {
            company_id: company.company_id,
            admin_verified: false,
            email_verified: false
        }
        const token = generateEmailToken(payload);

        await service.sendMail(email, 'E-Mail Bestätigung | Apprenticeship marketplace',
            `<p>Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie <a href="http://localhost:8081/verify_email/${token}">hier</a> klicken.</p>`);
        res.status(StatusCodes.CREATED).json("Registrierung erfolgreich")
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({Error: err})

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
            res.status(StatusCodes.NOT_FOUND).json([]);
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});

companyRouter.patch("/:id/verify_admin", async (req: Request, res: Response) => {
    const adminVerified: string = req.body.admin_verified;
    const company_id: number = parseInt(req.params.id);

    if (allowedBooleanStrings.includes(adminVerified) && isValidId(company_id)) {
        const unit: Unit = await Unit.create(false);
        try {
            const service = new CompanyService(unit);
            if (await service.companyExists(company_id)) {
                let success: boolean;

                if (allowedBooleanTrueStrings.includes(adminVerified)) {
                    success = await service.verifyAdmin(company_id);
                } else {
                    success = await service.unverifyAdmin(company_id);
                }

                if (success) {
                    await unit.complete(true);
                    res.status(StatusCodes.NO_CONTENT).send(`admin_verified was set to ${adminVerified}`);
                } else {
                    await unit.complete(false);
                    res.status(StatusCodes.CONFLICT).send("could not update admin_verified")
                }
            } else {
                res.status(StatusCodes.NOT_FOUND).send(`company with id ${company_id} does not exist`);
            }

        } catch (e) {
            console.log(e);
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        } finally {
            await unit.complete(false);
        }
    } else {
        res.status(StatusCodes.BAD_REQUEST).send("req body or param id was not valid");
    }
});

companyRouter.patch("/:id/verify_email", async (req: Request, res: Response) => {
    const emailVerified: string = req.body.email_verified;
    const company_id: number = parseInt(req.params.id);

    if (allowedBooleanStrings.includes(emailVerified) && isValidId(company_id)) {
        const unit: Unit = await Unit.create(false);
        try {
            const service = new CompanyService(unit);
            if (await service.companyExists(company_id)) {
                let success: boolean;

                if (allowedBooleanTrueStrings.includes(emailVerified)) {
                    success = await service.verifyEmail(company_id);
                } else {
                    success = await service.unverifyEmail(company_id);
                }

                if (success) {
                    await unit.complete(true);
                    res.status(StatusCodes.NO_CONTENT).send(`email_verified was set to ${emailVerified}`);
                } else {
                    await unit.complete(false);
                    res.status(StatusCodes.CONFLICT).send("could not update email_verified")
                }
            } else {
                res.status(StatusCodes.NOT_FOUND).send(`company with id ${company_id} does not exist`);
            }

        } catch (e) {
            console.log(e);
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        } finally {
            await unit.complete(false);
        }
    } else {
        res.status(StatusCodes.BAD_REQUEST).send("req body or param id was not valid");
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

companyRouter.get("/:id/internships", async (req: Request, res: Response) => {
    const company_id: number = parseInt(req.params.id);
    const unit: Unit = await Unit.create(true);
    const companyService = new CompanyService(unit);
    const internshipService = new InternshipService(unit);

    try {

        if (isValidId(company_id) && await companyService.companyExists(company_id)) {
            const internships: IInternshipUIProps[] = await internshipService.getByCompanyId(company_id);

            if (internships.length > 0) {
                res.status(StatusCodes.OK).json(internships);
            } else {
                res.status(StatusCodes.NOT_FOUND).json([]);
            }

        } else {
            res.status(StatusCodes.BAD_REQUEST).send("invalid id");
        }

    } catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }

});

companyRouter.get("/:id/sites", async (req: Request, res: Response) => {
    const company_id: number = parseInt(req.params.id);
    const unit: Unit = await Unit.create(true);
    const companyService = new CompanyService(unit);
    const siteService = new SiteService(unit);

    try {
        if (isValidId(company_id) && await companyService.companyExists(company_id)) {
            const sites: ISite[] = await siteService.getAllByCompanyId(company_id);

            if (sites.length > 0) {
                res.status(StatusCodes.OK).json(sites);
            } else {
                res.status(StatusCodes.NOT_FOUND).json([]);
            }

        } else {
            res.status(StatusCodes.BAD_REQUEST).send("invalid id");
        }

    } catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});

// to insert and update a new company
companyRouter.put("", async (req: Request, res: Response) => {
    const id: number = req.body.company_id === undefined ? -1 : parseInt(req.body.company_id);

    const company: ICompany = {
        company_id: id,
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

    try {
        const service = new CompanyService(unit);
        const companyExists: boolean = await service.companyExists(company.company_id);
        const validWebsite: boolean = company.website.substring(0, 8) === "https://";
        const validEmail: boolean = company.email.includes('@');
        const validVerifications: boolean = allowedBooleanStrings.includes(company.email_verified.toLowerCase()) && allowedBooleanStrings.includes(company.admin_verified.toLowerCase());

        if (validWebsite && validEmail && validVerifications
        && isValidCompanyNumber(company.company_number)
        && isValidDate(company.company_registration_timestamp)
        && (company.email_verification_timestamp ? isValidDate(company.email_verification_timestamp) : true) && (company.admin_verification_timestamp ? isValidDate(company.admin_verification_timestamp) : true) // some complex validation, because these timestamps can be null
        && companyExists ? isValidId(company.company_id) : true) { // id is not valid/null if we insert

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

companyRouter.delete("/:id", async (req: Request, res: Response) => {
    const unit: Unit = await Unit.create(false);
    try {
        const company_id: number = parseInt(req.params.id);
        const service = new CompanyService(unit);

        const companyExists: boolean = await service.companyExists(company_id);

        if (isValidId(company_id)) {
            if (!companyExists) {
                res.status(StatusCodes.OK).send("Nothing to delete; id was not found");
            } else {
                const success: boolean = await service.delete(company_id);
                if (success) {
                    await unit.complete(true);
                    res.status(StatusCodes.OK).send(`company with id ${company_id} was deleted`);
                } else {
                    await unit.complete(false);
                    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
                }
            }
        } else {
            res.sendStatus(StatusCodes.BAD_REQUEST);
        }

    } catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete(false);
    }

});

function isValidCompanyNumber(number: string): boolean {
    const nums: number = parseInt(number.substring(0, 6));
    const letter: number = parseInt(number.substring(6));

    return !isNaN(nums) && isNaN(letter);
}

companyRouter.get("/verify_email/:token", async (req: Request, res: Response) => {
    const token = req.params.token;


    jwt.verify(token, process.env.JWT_EMAIL_SECRET!, async (err, decoded: any) => {
        if (err || !decoded?.company_id) {
            console.log(err);
            return res.status(StatusCodes.UNAUTHORIZED).send("Email verification failed.");
        }

        const company_id = parseInt(decoded.company_id);
        if (!isValidId(company_id)) {
            return res.status(StatusCodes.BAD_REQUEST).send("Invalid company ID.");
        }

        const unit: Unit = await Unit.create(false);

        try {
            const service = new CompanyService(unit);

            if (await service.companyExists(company_id)) {
                const success = await service.verifyEmail(company_id);

                if (success) {
                    await unit.complete(true);
                    const payload = {
                        company_id: decoded.company_id,
                        admin_verified: decoded.admin_verified,
                        email_verified: true,
                    };

                    const newAccessToken = generateAccessToken(payload);
                    const newRefreshToken = generateRefreshToken(payload);

                    res.cookie('refreshToken', newRefreshToken, {
                        httpOnly: true,
                        sameSite: 'strict',
                        secure: false, // TODO: change at production to true
                        maxAge: 7 * 24 * 60 * 60 * 1000
                    })
                        .header('Authorization', `Bearer ${newAccessToken}`)
                        .status(StatusCodes.OK)
                        .json({accessToken: newAccessToken});
                } else {
                    await unit.complete(false);
                    res.status(StatusCodes.CONFLICT).send("E-Mail Konnte nicht geupadetet werden");
                    return;
                }
            } else {
                res.status(StatusCodes.NOT_FOUND).send(`Company with id ${company_id} does not exist.`);
                return;
            }

        } catch (e) {
            console.log(e);
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        } finally {
            await unit.complete(false);
        }
    });
});

companyRouter.patch("/reset-password", async (req: Request, res: Response) => {
    const {oldpassword, newpassword} = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({error: "No token"});
        return;
    }
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_ACCESS_SECRET!, async (err, decoded: any) => {
        if (err || !decoded?.company_id) {
            console.log(err);
            return res.status(StatusCodes.UNAUTHORIZED).send("Password Reset failed.");
        }

        const company_id = parseInt(decoded.company_id);
        console.log(company_id)
        if (!isValidId(company_id)) {
            return res.status(StatusCodes.BAD_REQUEST).send("Invalid company ID.");
        }

        const unit: Unit = await Unit.create(false);

        try {
            const service = new CompanyService(unit);
            const company: ICompany | null = await service.getById(company_id);

            if (company) {
                const isMatch: boolean = await argon2.verify(company.password, oldpassword);
                if (isMatch) {
                    const hashedPassword = await argon2.hash(newpassword, {
                        algorithm: argon2.Algorithm.Argon2id,
                        memoryCost: 2 ** 16,
                        timeCost: 3,
                        parallelism: 2,
                    });

                    const success = await service.resetPassword(company, hashedPassword);
                    if (success) {
                        await unit.complete(true);
                        res.status(StatusCodes.OK).send(`Password successfully resetted`);
                    } else {
                        await unit.complete(false);
                        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
                    }
                } else {
                    res.status(StatusCodes.UNAUTHORIZED).send("Wrong Password.");
                    return;
                }
            } else {
                res.status(StatusCodes.NOT_FOUND).send(`Company with id ${company_id} does not exist.`);
                return;
            }

        } catch (e) {
            console.log(e);
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        } finally {
            await unit.complete(false);
        }
    });
});

companyRouter.post("/send-password-reset-mail", async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        res.status(400).send("E-Mail ist erforderlich.");
        return;
    }

    const unit: Unit = await Unit.create(false);
    const service = new CompanyService(unit);

    try {
        const company = await service.getByEmail(email);

        if (!company) {
            res.status(StatusCodes.NOT_FOUND).send(`Company with email ${email} does not exist.`);
            return;
        }

        const payload = {
            company_id: company.company_id,
            admin_verified: company.admin_verified,
            email_verified: company.email_verified,
        };
        const token = generatePasswordResetToken(payload);
        const resetLink = `http://localhost:8081/reset-password?token=${token}`;

        await service.sendMail(
            company.email,
            "Passwort zurücksetzen",
            `
                <p>Hallo ${company.name},</p>
                <p>Sie haben angefordert, Ihr Passwort zurückzusetzen. Klicken Sie auf den folgenden Link:</p>
                <a href="${resetLink}">Passwort zurücksetzen</a>
                <p>Dieser Link ist für 30 Minuten gültig.</p>
                <p>Wenn Sie das nicht waren, ignorieren Sie diese Nachricht einfach.</p>
            `,
        );

        await unit.complete(true);
        res.status(StatusCodes.OK).send("Reset-E-Mail sent.");
    } catch (error) {
        console.error("Error sending password reset mail:", error);
        await unit.complete(false);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
    }
});
