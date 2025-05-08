import {ServiceBase} from "./service-base.js";
import {Unit} from '../unit.js';
import {IStudent} from "../model.js";

export class StudentService extends ServiceBase{
    constructor(unit: Unit) {
        super(unit);
    }

    public async getAll(): Promise<IStudent[]> {
        const stmt = await this.unit.prepare("select * from internship");
        return stmt.rows as IStudent[];
    }

    public async getById(id: number): Promise<IStudent>{
        const stmt = await this.unit.prepare("select description as 'department', address as 'site', name as 'duration',  from student where student_id = ?", [id]);
        return stmt.rows[0] as IStudent;
    }
}