import { Unit } from "../unit.js";
import {ServiceBase} from "./service-base.js";

export class DepartmentService extends ServiceBase {
    constructor(unit: Unit) {
        super(unit);
    }

    public async insertDepartments(internshipId: number, departments: number[]): Promise<boolean> {
        for(const department of departments) {
            const stmt = await this.unit.prepare(`INSERT INTO internship_department_map (internship_id, department_id) VALUES ($1, $2)`, [internshipId, department]);
            const result = await stmt.rows[0];
            if(result?.internship_id === null) {
                return false;
            }
        }
        return true;
    }

    public async deleteDepartmentsByInternshipId(internshipId: number): Promise<void> {
        const stmt = await this.unit.prepare(`DELETE FROM internship_department_map WHERE internship_id = $1`,
            [internshipId]);
        const result = await stmt.rows[0];

    }
}