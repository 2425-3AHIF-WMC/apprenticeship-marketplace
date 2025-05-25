import {ServiceBase} from "./service-base.js";
import {Unit} from '../unit.js';
import {IInternship, InternshipDetailsUIProps, InternshipUIProps} from "../model";

export class InternshipService extends ServiceBase{
    constructor(unit: Unit) {
        super(unit);
    }

    public async getAll(): Promise<InternshipUIProps[]> {
        const stmt = await this.unit.prepare(`select i.internship_id, i.title, c.name as "company_name", i.application_end, i.min_year, ci.name || ', ' || s.address as location,
                                                                         w.name as "work_type", c.company_logo, id.description as "duration", i.internship_creation_timestamp as "added",
                                                                         (select count(*)
                                                                          from viewed_internships vi
                                                                          where vi.internship_id = i.internship_id) as "views", ARRAY_REMOVE(ARRAY_AGG(DISTINCT d.name), NULL) AS category,
                                                                         c.website as "company_link", i.internship_application_link as "internship_link"
                                                                  from internship i
                                                                           join site s on (i.location_id = s.location_id)
                                                                           join city ci on (s.plz = ci.plz)
                                                                           join company c on (s.company_id = c.company_id)
                                                                           join worktype w on (i.worktype_id = w.worktype_id)
                                                                           join internship_duration id on (i.internship_duration_id = id.internship_duration_id)
                                                                           left join internship_department_map idm on (i.internship_id = idm.internship_id)
                                                                           left join department d ON d.department_id = idm.department_id
                                                                  group by i.internship_id, i.title, c.name, i.application_end, i.min_year, location, w.name, c.company_logo, id.description, i.internship_creation_timestamp, c.website, i.salary, i.internship_application_link, c.company_id, c.company_info;`);
        return await stmt.rows as InternshipUIProps[];
    }

    public async getAllCurrent(): Promise<InternshipUIProps[]>{
        const stmt = await this.unit.prepare(`select i.internship_id, i.title, c.name as "company_name", i.application_end, i.min_year, ci.name || ', ' || s.address as location,
                                                                         w.name as "work_type", c.company_logo, id.description as "duration", i.internship_creation_timestamp as "added",
                                                                         (select count(*)
                                                                          from viewed_internships vi
                                                                          where vi.internship_id = i.internship_id) as "views", ARRAY_REMOVE(ARRAY_AGG(DISTINCT d.name), NULL) AS category,
                                                                         c.website as "company_link", i.internship_application_link as "internship_link"
                                                                  from internship i
                                                                           join site s on (i.location_id = s.location_id)
                                                                           join city ci on (s.plz = ci.plz)
                                                                           join company c on (s.company_id = c.company_id)
                                                                           join worktype w on (i.worktype_id = w.worktype_id)
                                                                           join internship_duration id on (i.internship_duration_id = id.internship_duration_id)
                                                                           left join internship_department_map idm on (i.internship_id = idm.internship_id)
                                                                           left join department d ON d.department_id = idm.department_id
                                                                  WHERE i.application_end >= CURRENT_DATE
                                                                  group by i.internship_id, i.title, c.name, i.application_end, i.min_year, location, w.name, c.company_logo, id.description, i.internship_creation_timestamp, c.website, i.salary, i.internship_application_link, c.company_id, c.company_info;
        `);


        return await stmt.rows as InternshipUIProps[];
    }

    public async getById(id: number): Promise<InternshipDetailsUIProps>{
        const stmt = await this.unit.prepare(`select i.internship_id, i.title, c.name as "company_name", i.application_end, i.min_year, ci.name || ', ' || s.address  as location,
                                                                         w.name as "work_type", c.company_logo, id.description as "duration", i.internship_creation_timestamp as "added",
                                                                         (select count(*)
                                                                          from viewed_internships vi
                                                                          where vi.internship_id = i.internship_id) as "views", ARRAY_REMOVE(ARRAY_AGG(DISTINCT d.name), NULL) AS category,
                                                                         c.website as "company_link", i.salary, i.internship_application_link as "internship_link", c.company_id, c.company_info as "pdf"
                                                                  from internship i
                                                                           join site s on (i.location_id = s.location_id)
                                                                           join city ci on (s.plz = ci.plz)
                                                                           join company c on (s.company_id = c.company_id)
                                                                           join worktype w on (i.worktype_id = w.worktype_id)
                                                                           join internship_duration id on (i.internship_duration_id = id.internship_duration_id)
                                                                           left join internship_department_map idm on (i.internship_id = idm.internship_id)
                                                                           left join department d ON d.department_id = idm.department_id
                                                                  where i.internship_id = $1
                                                                  group by i.internship_id, i.title, c.name, i.application_end, i.min_year, location, w.name, c.company_logo, id.description, i.internship_creation_timestamp, c.website, i.salary, i.internship_application_link, c.company_id, c.company_info;
                        `, [id]);
        return stmt.rows[0] as InternshipDetailsUIProps;
    }

    public async newInternship(i: IInternship): Promise<number>{
        const stmt = await this.unit.prepare(`INSERT INTO internship (title, description, min_year, internship_creation_timestamp, salary, application_end, location_id, clicks, worktype_id, internship_duration_id, internship_application_link) 
                                                                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
                                                                   RETURNING internship_id;`
                                                            , [ i.title, i.description, i.min_year, i.internship_creation_timestamp, i.salary, i.application_end, i.location_id, i.clicks, i.worktype_id, i.internship_duration_id, i.internship_application_link]);

        const result = await stmt.rows[0];
        return result?.internship_id ?? -1;
    }

    public async updateInternship(i: IInternship): Promise<number>{
        const stmt = await this.unit.prepare(`UPDATE internship 
                                                                    set 
                                                                        title = $1,
                                                                        description = $2,
                                                                        min_year = $3,
                                                                        internship_creation_timestamp = $4,
                                                                        salary = $5,
                                                                        application_end = $6,
                                                                        location_id = $7,
                                                                        clicks = $8,
                                                                        worktype_id = $9,
                                                                        internship_duration_id = $10,
                                                                        internship_application_link = $11`
                                                            , [i.title, i.description, i.min_year, i.internship_creation_timestamp, i.salary, i.application_end, i.location_id, i.clicks, i.worktype_id, i.internship_duration_id, i.internship_application_link]);
        const result = await stmt.rows[0];
        return result?.internship_id ?? -1;
    }

    public async deleteInternship(id: number): Promise<number>{
        const stmt = await this.unit.prepare(`DELETE FROM internship 
                                                                   WHERE internship_id = $1
                                                                   RETURNING internship_id`
                                                              , [id]);
        const result = await stmt.rows[0];
        return result?.internship_id ?? -1;
    }
}