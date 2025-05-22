import {ServiceBase} from "./service-base.js";
import {Unit} from '../unit.js';
import {InternshipDetailsUIProps, InternshipUIProps} from "../model";

export class InternshipService extends ServiceBase{
    constructor(unit: Unit) {
        super(unit);
    }

    public async getAll(): Promise<InternshipUIProps[]> {
        const stmt = await this.unit.prepare(`select i.internship_id, i.title, c.name as "company_name", i.application_end, i.min_year, s.address as "location",
                                                                         w.name as "work_type", c.company_logo, id.description as "duration", i.internship_creation_timestamp as "added",
                                                                         (select count(*)
                                                                          from viewed_internships vi
                                                                          where vi.internship_id = i.internship_id) as "views", ARRAY_REMOVE(ARRAY_AGG(DISTINCT d.name), NULL) AS category,
                                                                         c.website as "company_link", i.internship_application_link as "internship_link"
                                                                  from internship i
                                                                           join site s on (i.location_id = s.location_id)
                                                                           join company c on (s.company_id = c.company_id)
                                                                           join worktype w on (i.worktype_id = w.worktype_id)
                                                                           join internship_duration id on (i.internship_duration_id = id.internship_duration_id)
                                                                           left join internship_department_map idm on (i.internship_id = idm.internship_id)
                                                                           left join department d ON d.department_id = idm.department_id
                                                                  group by i.internship_id, i.title, c.name, i.application_end, i.min_year, s.address, w.name, c.company_logo, id.description, i.internship_creation_timestamp, c.website, i.salary, i.internship_application_link, c.company_id, c.company_info;`);
        return await stmt.rows as InternshipUIProps[];
    }

    public async getAllCurrent(): Promise<InternshipUIProps[]>{
        const stmt = await this.unit.prepare(`select i.internship_id, i.title, c.name as "company_name", i.application_end, i.min_year, s.address as "location",
                                                                         w.name as "work_type", c.company_logo, id.description as "duration", i.internship_creation_timestamp as "added",
                                                                         (select count(*)
                                                                          from viewed_internships vi
                                                                          where vi.internship_id = i.internship_id) as "views", ARRAY_REMOVE(ARRAY_AGG(DISTINCT d.name), NULL) AS category,
                                                                         c.website as "company_link", i.internship_application_link as "internship_link"
                                                                  from internship i
                                                                           join site s on (i.location_id = s.location_id)
                                                                           join company c on (s.company_id = c.company_id)
                                                                           join worktype w on (i.worktype_id = w.worktype_id)
                                                                           join internship_duration id on (i.internship_duration_id = id.internship_duration_id)
                                                                           left join internship_department_map idm on (i.internship_id = idm.internship_id)
                                                                           left join department d ON d.department_id = idm.department_id
                                                                  WHERE i.application_end >= CURRENT_DATE
                                                                  group by i.internship_id, i.title, c.name, i.application_end, i.min_year, s.address, w.name, c.company_logo, id.description, i.internship_creation_timestamp, c.website, i.salary, i.internship_application_link, c.company_id, c.company_info;
        `);


        return await stmt.rows as InternshipUIProps[];
    }

    public async getById(id: number): Promise<InternshipDetailsUIProps>{
        const stmt = await this.unit.prepare(`select i.internship_id, i.title, c.name as "company_name", i.application_end, i.min_year, s.address as "location",
                                                                    w.name as "work_type", c.company_logo, id.description as "duration", i.internship_creation_timestamp as "added",
                                                                    (select count(*)
                                                                          from viewed_internships vi
                                                                          where vi.internship_id = i.internship_id) as "views", ARRAY_REMOVE(ARRAY_AGG(DISTINCT d.name), NULL) AS category,
                                                                         c.website as "company_link", i.salary, i.internship_application_link as "internship_link", c.company_id, c.company_info as "pdf"
                                                                  from internship i
                                                                           join site s on (i.location_id = s.location_id)
                                                                           join company c on (s.company_id = c.company_id)
                                                                           join worktype w on (i.worktype_id = w.worktype_id)
                                                                           join internship_duration id on (i.internship_duration_id = id.internship_duration_id)
                                                                           left join internship_department_map idm on (i.internship_id = idm.internship_id)
                                                                           left join department d ON d.department_id = idm.department_id
                    
                                                                  where i.internship_id = $1
                                                                  group by i.internship_id, i.title, c.name, i.application_end, i.min_year, s.address, w.name, c.company_logo, id.description, i.internship_creation_timestamp, c.website, i.salary, i.internship_application_link, c.company_id, c.company_info;
                        `, [id]);
        return stmt.rows[0] as InternshipDetailsUIProps;
    }
}