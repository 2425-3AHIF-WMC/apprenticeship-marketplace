import {ServiceBase} from "./service-base.js";
import {Unit} from "../unit.js";
import {ICompany, ICompanySmall} from "../model.js";

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
                                                     email_verfication_timestamp,
                                                     admin_verification_timestamp
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
                                                     email_verfication_timestamp,
                                                     admin_verification_timestamp
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
                                                     email_verfication_timestamp,
                                                     admin_verification_timestamp
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
                                                     email_verfication_timestamp,
                                                     admin_verification_timestamp
                                              from company
                                              where admin_verified = 'no'`);
        return stmt.rows as ICompany[];
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
                                                  email_verfication_timestamp=$11,
                                                  admin_verification_timestamp=$12
                                              where company_id = $13`, [
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
            company.company_id
        ]);

        return stmt.rowCount !== null ? stmt.rowCount > 0 : false;
    }

    public async insert(company: ICompany): Promise<boolean> {
        const stmt = await this.unit.prepare(`INSERT INTO Company (name, company_number, company_info, website, email,
                                                                   phone_number, password, email_verified,
                                                                   admin_verified, company_registration_timestamp,
                                                                   email_verification_timestamp,
                                                                   admin_verification_timestamp)
                                              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`, [
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
            company.admin_verification_timestamp?.toISOString() ?? null
        ]);

        return stmt.rowCount !== null ? stmt.rowCount > 0 : false;
    }
}