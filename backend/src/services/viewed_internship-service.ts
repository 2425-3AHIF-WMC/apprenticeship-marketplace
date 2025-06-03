import {ServiceBase} from "./service-base.js";
import {Unit} from "../unit.js";

export class ViewedInternshipService extends ServiceBase {
    constructor(unit: Unit) {
        super(unit);
    }

    public async insert(studentId: number, internshipId: number): Promise<boolean> {
        const stmt = await this.unit.prepare(`insert into viewed_internships (student_id, internship_id, viewed_timestamp)
                                              values ($1, $2, NOW())`, [studentId, internshipId]);

        return stmt.rowCount !== null ? stmt.rowCount > 0 : false;
    }

    public async getCountOfStudent(studentId: number): Promise<number> {
        return -1;
    }
}