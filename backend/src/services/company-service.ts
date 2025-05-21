import {ServiceBase} from "./service-base.js";
import {Unit} from "../unit.js";
import {ICompany, ICompanySmall} from "../model.js";

export class CompanyService extends ServiceBase {
    constructor(unit: Unit) {
        super(unit);
    }

    public async getAll():Promise<ICompany[]>{
        const stmt = await this.unit.prepare(`select company_id, name, company_number, company_info, website, email, phone_number, password, email_verified, admin_verified, company_registration_timestamp, email_verfication_timestamp, admin_verification_timestamp from company`);
        return stmt.rows as ICompany[];
    }

    public async getById(id: number): Promise<ICompany | null> {
        const stmt = await this.unit.prepare(`select company_id, name, company_number, company_info, website, email, phone_number, password, email_verified, admin_verified, company_registration_timestamp, email_verfication_timestamp, admin_verification_timestamp from company where company_id=$1`, [id]);
        return ServiceBase.nullIfUndefined(stmt.rows[0] as ICompany);
    }

    public async getByIdSmall(id:number): Promise<ICompanySmall | null> {
        const stmt = await this.unit.prepare(`select company_id, name, email from company where company_id=$1`, [id]);
        return ServiceBase.nullIfUndefined(stmt.rows[0] as ICompanySmall);
    }

    public async getByEmail(email: string): Promise<ICompany | null> {
        const stmt = await this.unit.prepare(`select company_id, name, company_number, company_info, website, email, phone_number, password, email_verified, admin_verified, company_registration_timestamp, email_verfication_timestamp, admin_verification_timestamp from company where email=$1`, [email]);
        return ServiceBase.nullIfUndefined(stmt.rows[0] as ICompany);
    }
}