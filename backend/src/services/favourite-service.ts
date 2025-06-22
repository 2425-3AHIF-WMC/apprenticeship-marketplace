import {ServiceBase} from "./service-base.js";
import {Unit} from "../unit.js";
import {IFavourite} from "../model";

export class FavouriteService extends ServiceBase {
    constructor(unit: Unit) {
        super(unit);
    }

    public async insertFavourite(f: IFavourite): Promise<number> {
        const stmt = await this.unit.prepare(`INSERT INTO favourite (student_id, internship_id, favourite_creation_timestamp)
                                              VALUES ($1, $2,
                                                      $3) RETURNING internship_id;`, [f.student_id, f.internship_id, f.added]);

        const result = await stmt.rows[0];
        return result?.internship_id ?? -1;
    }

    public async deleteFavourite(internship_id: number, student_id: number): Promise<number> {
        const stmt = await this.unit.prepare(`DELETE
                                              FROM favourite
                                              WHERE internship_id = $1
                                                AND student_id = $2 RETURNING internship_id`, [internship_id, student_id]);
        const result = await stmt.rows[0];
        return result?.internship_id ?? -1;
    }

    public async getCountOfFavouriteByCompany(companyId: number): Promise<number> {
        const stmt = await this.unit.prepare(`select count(*)
                                              from favourite f
                                                       join internship i on (f.internship_id = i.internship_id)
                                                       join site s on (i.location_id = s.location_id)
                                              where s.company_id = $1`, [companyId]);
        return stmt.rows[0].count || 0;
    }

    public async getCountOfFavouriteByInternship(internshipId: number): Promise<number> {
        const stmt = await this.unit.prepare(`select count(*)
                                              from favourite
                                              where internship_id = $1`, [internshipId]);
        return stmt.rows[0].count || 0;
    }
}