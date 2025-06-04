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

    public async update(studentId: number, internshipId: number): Promise<boolean> {
        const stmt = await this.unit.prepare(`update viewed_internships
                                              set viewed_timestamp=NOW()
                                              where student_id = $1
                                                and internship_id = $2`, [studentId, internshipId]);

        return stmt.rowCount !== null ? stmt.rowCount > 0 : false;
    }

    public async getCountOfInternship(studentId: number): Promise<number> {
        const stmt = await this.unit.prepare(`select count(*)
                                                                from viewed_internships
                                                                where internship_id = $1`, [studentId]);
        return stmt.rows[0].count || 0;
    }

    public async getCountOfStudentLast30Days(studentId: number): Promise<number> {
        const stmt = await this.unit.prepare(`SELECT COUNT(*)
                                              FROM viewed_internships
                                              WHERE student_id = $1
                                                AND viewed_timestamp >= NOW() - INTERVAL '30 days'`, [studentId]);
        return stmt.rows[0].count || 0;
    }

    public async viewedInternshipExists(studentId: number, internshipId: number): Promise<boolean> {
        const stmt = await this.unit.prepare(`select count(*)
                                              from viewed_internships
                                              where student_id = $1
                                                and internship_id = $2`, [studentId, internshipId]);
        const count: number = parseInt(stmt.rows[0].count, 10);

        return count === 1;
    }
}