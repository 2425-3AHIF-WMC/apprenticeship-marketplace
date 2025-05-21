import {ServiceBase} from "./service-base.js";
import {Unit} from '../unit.js';
import {IInternship, IInternshipDetailed, IStudent} from "../model.js";

export class InternshipService extends ServiceBase{
    constructor(unit: Unit) {
        super(unit);
    }

    public async getAll(): Promise<IInternship[]> {
        const stmt = await this.unit.prepare(`select i.internship_id, i.title, c.name as "company_name", i.application_end, i.min_year, array_agg(d.name) as "department", s.address as "site", wt.name as "work_type", c.company_logo, id.description as "duration"
                                                                    from internship i
                                                                        join worktype wt on(i.worktype_id = wt.worktype_id)
                                                                        join internship_duration id on (i.internship_duration_id = id.internship_duration_id)
                                                                        join internship_department_map idm on(i.internship_id = idm.internship_id)
                                                                        join department d on (idm.department_id = d.department_id)
                                                                        join site s on(i.location_id = s.location_id)
                                                                        join company c on (s.company_id = c.company_id)
                                                                    group by
                                                                        i.internship_id, s.address, internship_duration.description, i.description, i.salary,
                                                                        i.application_end, i.min_year, w.name, i.title, c.name, c.company_info, c.company_logo;`);
        return stmt.rows as IInternship[];
    }

    public async getAllCurrent(): Promise<IInternship[]> {
        const stmt = await this.unit.prepare(`select i.internship_id, i.title, c.name as "company_name", i.application_end, i.min_year, array_agg(d.name) as "department", s.address as "site", wt.name as "work_type", c.company_logo, id.description as "duration"
                                                                    from internship i
                                                                        join worktype wt on(i.worktype_id = wt.worktype_id)
                                                                        join internship_duration id on (i.internship_duration_id = id.internship_duration_id)
                                                                        join internship_department_map idm on(i.internship_id = idm.internship_id)
                                                                        join department d on (idm.department_id = d.department_id)
                                                                        join site s on(i.location_id = s.location_id)
                                                                        join company c on (s.company_id = c.company_id)
                                                                    WHERE i.application_end > CURRENT_DATE
                                                                    group by
                                                                        i.internship_id, s.address, internship_duration.description, i.description, i.salary,
                                                                        i.application_end, i.min_year, w.name, i.title, c.name, c.company_info, c.company_logo;`);
        return stmt.rows as IInternship[];
    }

    public async getById(id: number): Promise<IInternshipDetailed>{
        const stmt = await this.unit.prepare(`select i.internship_id, array_agg(d.name) as "department", s.address as "site", internship_duration.description as "duration", i.description, i.salary, i.application_end, i.min_year, w.name as "work_type", i.title, c.name as "company_name", c.company_info, c.company_logo
                                                                    from internship i
                                                                        join worktype w on (i.worktype_id = w.worktype_id)
                                                                        join internship_duration on (i.internship_duration_id = internship_duration.internship_duration_id)
                                                                        join internship_department_map idm on (i.internship_id = idm.internship_id)
                                                                        join department d on (idm.department_id = d.department_id)
                                                                        join site s on (s.location_id = i.location_id)
                                                                        join company c on (s.company_id = c.company_id)
                                                                    where i.internship_id = $1
                                                                    group by 
                                                                        i.internship_id, s.address, internship_duration.description, i.description, i.salary, 
                                                                        i.application_end, i.min_year, w.name, i.title, c.name, c.company_info, c.company_logo;`, [id]);
        return stmt.rows[0] as IInternshipDetailed;
    }

    public async getDepartmentsByInternship(id:number){

    }
}