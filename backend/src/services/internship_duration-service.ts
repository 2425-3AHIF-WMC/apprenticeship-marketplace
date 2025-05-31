import {ServiceBase} from "./service-base.js";
import {Unit} from '../unit.js';
import {IInternship, IInternShipDuration, IStudent, IWorktype, PersonType} from "../model.js";

export class InternshipDurationService extends ServiceBase{
    constructor(unit: Unit) {
        super(unit);
    }

    public async getAll(): Promise<IInternShipDuration[]> {
        const stmt = await this.unit.prepare(`select internship_duration_id, description from internship_duration`);
        return stmt.rows as IInternShipDuration[];
    }
}