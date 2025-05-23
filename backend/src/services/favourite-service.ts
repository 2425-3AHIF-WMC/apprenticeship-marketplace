import {ServiceBase} from "./service-base.js";
import {Unit} from "../unit.js";
import {IFavourite} from "../model";

export class FavouriteService extends ServiceBase {
    constructor(unit: Unit) {
        super(unit);
    }

    public async insertFavourite(f: IFavourite):Promise<number>{
        const stmt = await this.unit.prepare(`INSERT INTO favourite (student_id, internship_id, favourite_creation_timestamp) 
                                                                   VALUES ($1, $2, $3) 
                                                                   RETURNING internship_id;`
            , [f.studentId, f.internshipId, f.added]);

        const result = await stmt.rows[0];
        return result?.internship_id ?? -1;
    }

    public async deleteFavourite(internship_id: number, student_id: number): Promise<number>{
        const stmt = await this.unit.prepare(`DELETE FROM favourite 
                                                                   WHERE internship_id = $1
                                                                       AND student_id = $2
                                                                   RETURNING internship_id`
                                                              , [internship_id, student_id]);
        const result = await stmt.rows[0];
        return result?.internship_id ?? -1;
    }
}