import {ServiceBase} from "./service-base.js";
import {Unit} from "../unit.js";

export class FavouriteService extends ServiceBase {
    constructor(unit: Unit) {
        super(unit);
    }

    public async insertFavourite(f: IFavourite):Promise<number>{
        const stmt = await this.unit.prepare(`INSERT INTO internship (internship_id, title, description, min_year, internship_creation_timestamp, salary, application_end, location_id, clicks, worktype_id, internship_duration_id, internship_application_link) 
                                                                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
                                                                   RETURNING internship_id;`
            , [i.internship_id, i.title, i.description, i.min_year, i.internship_creation_timestamp, i.salary, i.application_end, i.location_id, i.clicks, i.worktype_id, i.internship_duration_id, i.internship_application_link]);

        const result = await stmt.rows[0];
        return result?.internship_id ?? -1;
    }
}