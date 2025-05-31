import {ServiceBase} from "./service-base.js";
import {Unit} from "../unit.js";
import {ICompany, ISite} from "../model.js";

export class SiteService extends ServiceBase {
    constructor(unit: Unit) {
        super(unit);
    }

    public async getAllByCompanyId(id: number):Promise<ISite[]> {
        const stmt = await this.unit.prepare(`select location_id, address, name, company_id, plz
                                              from site
                                              where company_id = $1`, [id]);

        return stmt.rows as ISite[];
    }

}