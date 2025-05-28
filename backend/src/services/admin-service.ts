import {ServiceBase} from "./service-base.js";
import {Unit} from "../unit.js";
import {PersonType} from "../model.js";

export class AdminService extends ServiceBase {
    constructor(unit: Unit) {
        super(unit);
    }

    public async existsAdmin(admin_id:number):  Promise<boolean> {
        const stmt = await this.unit.prepare(`select count(person_id) from person where person_id=$1 and persontype=$2`, [admin_id, PersonType.Admin]);
        const count: number = parseInt(stmt.rows[0].count, 10);
        return count === 1;
    }

}