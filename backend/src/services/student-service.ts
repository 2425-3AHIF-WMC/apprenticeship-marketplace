import {ServiceBase} from "./service-base.js";
import {Unit} from '../unit.js';
import {IStudent} from "../model.js";

export class StudentService extends ServiceBase{
    constructor(unit: Unit) {
        super(unit);
    }

    public async getAll(): Promise<IStudent[]> {
        const stmt = await this.unit.prepare(`select person_id, username, person_creation_timestamp, persontype from person where persontype = 'Student'`);
        return stmt.rows as IStudent[];
    }

    public async getById(id: number): Promise<IStudent>{
        const stmt = await this.unit.prepare("select person_id, username, person_creation_timestamp, persontype from person where person_id=$1 and persontype = 'Student'", [id]);
        return stmt.rows[0] as IStudent;
    }
}