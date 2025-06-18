import {ServiceBase} from "./service-base.js";
import {Unit} from "../unit.js";

export class ClickedApplyInternshipService extends ServiceBase {
    constructor(unit: Unit) {
        super(unit);
    }

    public async insert(studentId: number, internshipId: number): Promise<boolean> {
        const stmt = await this.unit.prepare(`insert into clicked_apply_internships (student_id, internship_id, clicked_timestamp)
                                              values ($1, $2, NOW())`, [studentId, internshipId]);

        return stmt.rowCount !== null ? stmt.rowCount > 0 : false;
    }

    public async update(studentId: number, internshipId: number): Promise<boolean> {
        const stmt = await this.unit.prepare(`update clicked_apply_internships
                                              set clicked_timestamp=NOW()
                                              where student_id = $1
                                                and internship_id = $2`, [studentId, internshipId]);

        return stmt.rowCount !== null ? stmt.rowCount > 0 : false;
    }

    public async getCountOfInternshipLast90Days(internship_id: number): Promise<number> {
        const stmt = await this.unit.prepare(`select count(*)
                                                                from clicked_apply_internships
                                                                where internship_id = $1
                                                                  AND clicked_timestamp >= NOW() - INTERVAL '90 days'`, [internship_id]);
        return stmt.rows[0].count || 0;
    }

    public async getCountOfInternshipsByCompanyLast90Days(companyId: number): Promise<number> {
        const stmt = await this.unit.prepare(`select count(*)
                                              from clicked_apply_internships cai
                                                       join internship i on (cai.internship_id = i.internship_id)
                                                       join site s on (i.location_id = s.location_id)
                                              where s.company_id=$1
                                                and clicked_timestamp >= NOW() - INTERVAL '90 days'`, [companyId]);
        return stmt.rows[0].count || 0;
    }

    public async clickedApplyInternshipExists(studentId: number, internshipId: number): Promise<boolean> {
        const stmt = await this.unit.prepare(`select count(*)
                                              from clicked_apply_internships
                                              where student_id = $1
                                                and internship_id = $2`, [studentId, internshipId]);
        const count: number = parseInt(stmt.rows[0].count, 10);

        return count === 1;
    }
}