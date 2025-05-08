import {ServiceBase} from "./service-base.js";
import {Unit} from '../unit.js';
import {IInternshipDetailed, IStudent} from "../model.js";

export class InternshipService extends ServiceBase{
    constructor(unit: Unit) {
        super(unit);
    }

    public async getAll(): Promise<IStudent[]> {
        const stmt = await this.unit.prepare("select * from internship");
        return stmt.rows as IStudent[];
    }

    public async getById(id: number): Promise<IInternshipDetailed>{
        const stmt = await this.unit.prepare(`select d.name as "department", s.address as "site", internship_duration.description as "duration", i.description, i.salary, i.application_end, i.min_year, w.name as "work_type", i.title, c.name as "company_name", c.company_info, c.company_logo
                                                                    from internship i
                                                                        join worktype w on (i.worktype_id = w.worktype_id)
                                                                        join internship_duration on (i.internship_duration_id = internship_duration.internship_duration_id)
                                                                        join internship_department_map idm on (i.internship_id = idm.internship_id)
                                                                        join department d on (idm.department_id = d.department_id)
                                                                        join site s on (s.location_id = i.location_id)
                                                                        join company c on (s.company_id = c.company_id)
                                                                    where i.internship_id = ?;`, [id]);
        return stmt.rows[0] as IInternshipDetailed;
    }
}