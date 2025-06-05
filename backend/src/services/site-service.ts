import {ServiceBase} from "./service-base.js";
import {Unit} from "../unit.js";
import {ICompany, ISite} from "../model.js";

export class SiteService extends ServiceBase {
    constructor(unit: Unit) {
        super(unit);
    }

    public async getAllByCompanyId(id: number):Promise<ISite[]> {
        const stmt = await this.unit.prepare(`select location_id, address, name, company_id, plz, city
                                              from site
                                              where company_id = $1`, [id]);

        return stmt.rows as ISite[];
    }

    public async insert(site: ISite): Promise<boolean> {
        const stmt = await this.unit.prepare(`INSERT INTO site (address, name, company_id, plz, city)
                                              VALUES ($1, $2, $3, $4, $5)`, [
            site.address,
            site.name,
            site.company_id,
            site.plz,
            site.city
        ]);

        return stmt.rowCount !== null ? stmt.rowCount > 0 : false;
    }

    public async update(site: ISite): Promise<boolean> {
        const stmt = await this.unit.prepare(`UPDATE site
                                              SET address = $1,
                                                  name = $2,
                                                  company_id = $3,
                                                  plz = $4,
                                                  city = $5
                                              WHERE location_id = $6`, [
            site.address,
            site.name,
            site.company_id,
            site.plz,
            site.city,
            site.location_id
        ]);

        return stmt.rowCount !== null ? stmt.rowCount > 0 : false;
    }

    public async delete(id: number): Promise<boolean> {
        const stmt = await this.unit.prepare(`DELETE FROM site WHERE location_id = $1`, [id]);

        return stmt.rowCount !== null ? stmt.rowCount > 0 : false;
    }

    public async exists(id: number): Promise<boolean> {
        const stmt = await this.unit.prepare(`SELECT COUNT(*) FROM site WHERE location_id = $1`, [id]);
        const count = parseInt(stmt.rows[0].count, 10);
        return count > 0;
    }

}