import {ServiceBase} from "./service-base.js";
import {Unit} from "../unit.js";
import {ICompany, ICompanyPayload, ICompanySmall} from "../model.js";
import * as nodemailer from "nodemailer"
import jwt from "jsonwebtoken";

export class CompanyService extends ServiceBase {
    constructor(unit: Unit) {
        super(unit);
    }

    public async getAll(): Promise<ICompany[]> {
        const stmt = await this.unit.prepare(`select company_id,
                                                     name,
                                                     company_number,
                                                     company_info,
                                                     website,
                                                     email,
                                                     phone_number,
                                                     password,
                                                     email_verified,
                                                     admin_verified,
                                                     company_registration_timestamp,
                                                     email_verification_timestamp,
                                                     admin_verification_timestamp,
                                                     company_logo_path
                                              from company`);
        return stmt.rows as ICompany[];
    }

    public async getById(id: number): Promise<ICompany | null> {
        const stmt = await this.unit.prepare(`select company_id,
                                                     name,
                                                     company_number,
                                                     company_info,
                                                     website,
                                                     email,
                                                     phone_number,
                                                     password,
                                                     email_verified,
                                                     admin_verified,
                                                     company_registration_timestamp,
                                                     email_verification_timestamp,
                                                     admin_verification_timestamp,
                                                     company_logo_path
                                              from company
                                              where company_id = $1`, [id]);
        return ServiceBase.nullIfUndefined(stmt.rows[0] as ICompany);
    }

    public async getByIdSmall(id: number): Promise<ICompanySmall | null> {
        const stmt = await this.unit.prepare(`select company_id, name, email
                                              from company
                                              where company_id = $1`, [id]);
        return ServiceBase.nullIfUndefined(stmt.rows[0] as ICompanySmall);
    }

    public async getByEmail(email: string): Promise<ICompany | null> {
        const stmt = await this.unit.prepare(`select company_id,
                                                     name,
                                                     company_number,
                                                     company_info,
                                                     website,
                                                     email,
                                                     phone_number,
                                                     password,
                                                     email_verified,
                                                     admin_verified,
                                                     company_registration_timestamp,
                                                     email_verification_timestamp,
                                                     admin_verification_timestamp,
                                                     company_logo_path
                                              from company
                                              where email = $1`, [email]);
        return ServiceBase.nullIfUndefined(stmt.rows[0] as ICompany);
    }

    public async getByUnverifiedAdmin(): Promise<ICompany[]> {
        const stmt = await this.unit.prepare(`select company_id,
                                                     name,
                                                     company_number,
                                                     company_info,
                                                     website,
                                                     email,
                                                     phone_number,
                                                     password,
                                                     email_verified,
                                                     admin_verified,
                                                     company_registration_timestamp,
                                                     email_verification_timestamp,
                                                     admin_verification_timestamp,
                                                     company_logo_path
                                              from company
                                              where admin_verified = 'no'
                                                and email_verified = 'yes'`);
        return stmt.rows as ICompany[];
    }

    public async getVerifiedEmailUnverifiedAdminCount(): Promise<number> {
        const stmt = await this.unit.prepare(`select count(company_id)
                                              from company
                                              where email_verified = 'true'
                                                and admin_verified = 'false'`);
        return parseInt(stmt.rows[0].count);
    }

    public async update(company: ICompany): Promise<boolean> {
        const stmt = await this.unit.prepare(`update company
                                              set name=$1,
                                                  company_number=$2,
                                                  company_info=$3,
                                                  website=$4,
                                                  email=$5,
                                                  phone_number=$6,
                                                  password=$7,
                                                  email_verified=$8,
                                                  admin_verified=$9,
                                                  company_registration_timestamp=$10,
                                                  email_verification_timestamp=$11,
                                                  admin_verification_timestamp=$12,
                                                  company_logo_path=$13
                                              where company_id = $14`, [
            company.name,
            company.company_number,
            company.company_info,
            company.website,
            company.email,
            company.phone_number,
            company.password,
            company.email_verified,
            company.admin_verified,
            company.company_registration_timestamp.toISOString(),
            company.email_verification_timestamp?.toISOString() ?? null,
            company.admin_verification_timestamp?.toISOString() ?? null,
            company.company_logo_path ?? null,
            company.company_id
        ]);

        return stmt.rowCount !== null ? stmt.rowCount > 0 : false;
    }

    public async verifyAdmin(company_id: number): Promise<boolean> {
        const stmt = await this.unit.prepare(`update company
                                              set admin_verified='true',
                                                  admin_verification_timestamp=NOW()
                                              where company_id = $1`, [
            company_id
        ]);

        return stmt.rowCount !== null ? stmt.rowCount > 0 : false;
    }

    public async unverifyAdmin(company_id: number): Promise<boolean> {
        const stmt = await this.unit.prepare(`update company
                                              set admin_verified='false',
                                                  admin_verification_timestamp=null
                                              where company_id = $1`, [
            company_id
        ]);

        return stmt.rowCount !== null ? stmt.rowCount > 0 : false;
    }

    public async verifyEmail(company_id: number): Promise<boolean> {
        const stmt = await this.unit.prepare(`update company
                                              set email_verified='true',
                                                  email_verification_timestamp=NOW()
                                              where company_id = $1`, [
            company_id
        ]);

        return stmt.rowCount !== null ? stmt.rowCount > 0 : false;
    }

    public async unverifyEmail(company_id: number): Promise<boolean> {
        const stmt = await this.unit.prepare(`update company
                                              set email_verified='false',
                                                  email_verification_timestamp=null
                                              where company_id = $1`, [
            company_id
        ]);

        return stmt.rowCount !== null ? stmt.rowCount > 0 : false;
    }

    public async isEmailVerified(company_id: number): Promise<boolean> {
        const stmt = await this.unit.prepare(`select email_verified
                                              from company
                                              where company_id = $1`, [company_id]);

        return stmt.rows[0].email_verified === true;
    }

    public async insert(company: ICompany): Promise<boolean> {
        const stmt = await this.unit.prepare(`INSERT INTO Company (name, company_number, company_info, website, email,
                                                                   phone_number, password, email_verified,
                                                                   admin_verified, company_registration_timestamp,
                                                                   email_verification_timestamp,
                                                                   admin_verification_timestamp, company_logo_path)
                                              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`, [
            company.name,
            company.company_number,
            company.company_info,
            company.website,
            company.email,
            company.phone_number,
            company.password,
            company.email_verified,
            company.admin_verified,
            company.company_registration_timestamp,
            company.email_verification_timestamp?.toISOString() ?? null,
            company.admin_verification_timestamp?.toISOString() ?? null,
            company.company_logo_path ?? null
        ]);

        return stmt.rowCount !== null ? stmt.rowCount > 0 : false;
    }

    public async insertAndReturn(company: ICompany): Promise<ICompanyPayload> {
        const stmt = await this.unit.prepare(`INSERT INTO COMPANY(name, company_number, company_info, website, email,
                                                                  phone_number,
                                                                  password, email_verified,
                                                                  admin_verified, company_registration_timestamp,
                                                                  email_verification_timestamp,
                                                                  admin_verification_timestamp, company_logo_path)
                                              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), $10, $11,
                                                      $12)
                                              RETURNING company_id, admin_verified, email_verified`, [
            company.name,
            company.company_number,
            company.company_info ?? null,
            company.website,
            company.email,
            company.phone_number,
            company.password,
            company.email_verified,
            company.admin_verified,
            company.email_verification_timestamp?.toISOString() ?? null,
            company.admin_verification_timestamp?.toISOString() ?? null,
            company.company_logo_path ?? null
        ]);

        return stmt.rows[0] as ICompanyPayload;

    }

    public async delete(id: number): Promise<boolean> {
        const stmt = await this.unit.prepare(`DELETE
                                              FROM company
                                              WHERE company_id = $1`, [id]);

        return stmt.rowCount !== null ? stmt.rowCount > 0 : false;
    }

    public async companyExists(id: number): Promise<boolean> {
        const stmt = await this.unit.prepare(`select count(company_id)
                                              from company
                                              where company_id = $1`, [id])
        const count: number = parseInt(stmt.rows[0].count, 10);

        return count === 1;
    }

    public async sendMail(email: string, subject: string, body: string): Promise<void> {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST!,
            port: 587,
            auth: {
                user: process.env.EMAIL_USER!,
                pass: process.env.EMAIL_PASS!
            }
        });


        const mailConfigurations = {
            from: `"Apprenticeship Marketplace" <${process.env.EMAIL_USER!}>`,
            to: email,
            subject: `${subject}`,


            html: `${body}`
        };

        transporter.sendMail(mailConfigurations, function (error, info) {
            if (error) {
                console.log(error);
            }
            console.log('Email Sent Successfully');
            console.log(info);
        });
    }

    public async resetPassword(company: ICompany, new_password: string): Promise<boolean> {
        const stmt = await this.unit.prepare(`update company
                                              set password=$1
                                              where company_id = $2`, [new_password, company.company_id]);

        return stmt.rowCount !== null ? stmt.rowCount > 0 : false;
    }

    public async updateLogoPath(company_id: number, logoPath: string | null): Promise<boolean> {
        const stmt = await this.unit.prepare(
            `UPDATE company
             SET company_logo_path = $1
             WHERE company_id = $2`,
            [logoPath, company_id]
        );
        return stmt.rowCount !== null ? stmt.rowCount > 0 : false;
    }

    public async updateCompanyInfo(company_id: number, company_info: string): Promise<boolean> {
        const result = await this.unit.prepare(
            `UPDATE company
             SET company_info = $1
             WHERE company_id = $2`,
            [company_info, company_id]
        );
        return result.rowCount != null ? result.rowCount > 0 : false

    }
}