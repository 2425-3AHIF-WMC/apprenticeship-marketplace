import {ServiceBase} from "./service-base.js";
import {Unit} from '../unit.js';
import {IStudent, IWorktype, PersonType} from "../model.js";

export class WorktypeService extends ServiceBase{
    constructor(unit: Unit) {
        super(unit);
    }

    public async getAll(): Promise<IWorktype[]> {
        const stmt = await this.unit.prepare(`select worktype_id, name, description from worktype`);
        return stmt.rows as IWorktype[];
    }
}