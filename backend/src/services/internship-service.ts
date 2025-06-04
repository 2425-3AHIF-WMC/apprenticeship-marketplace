import {ServiceBase} from "./service-base.js";
import {Unit} from '../unit.js';

import {IInternship, IInternshipDetailsUIProps, IInternshipId, IInternshipUIProps} from "../model";

export class InternshipService extends ServiceBase{
    constructor(unit: Unit) {
        super(unit);
    }

    public async getAll(): Promise<IInternshipUIProps[]> {
        const stmt = await this.unit.prepare(`select i.internship_id, i.title, c.name as "company_name", i.application_end, i.min_year, s.city || ', ' || s.address as location,
                                                                         w.name as "work_type", c.company_logo_path, id.description as "duration", i.internship_creation_timestamp as "added",
                                                                         (select count(*)
                                                                          from viewed_internships vi
                                                                          where vi.internship_id = i.internship_id) as "views", ARRAY_REMOVE(ARRAY_AGG(DISTINCT d.name), NULL) AS category,
                                                                         c.website as "company_link", i.internship_application_link as "internship_link", c.admin_verified
                                                                  from internship i
                                                                           join site s on (i.location_id = s.location_id)
                                                                           join company c on (s.company_id = c.company_id)
                                                                           join worktype w on (i.worktype_id = w.worktype_id)
                                                                           join internship_duration id on (i.internship_duration_id = id.internship_duration_id)
                                                                           left join internship_department_map idm on (i.internship_id = idm.internship_id)
                                                                           left join department d ON d.department_id = idm.department_id
                                                                  group by i.internship_id, i.title, c.name, i.application_end, i.min_year, location, w.name, c.company_logo_path, id.description, i.internship_creation_timestamp, c.website, i.salary, i.internship_application_link, c.company_id, c.company_info, c.admin_verified;`);
        return await stmt.rows as IInternshipUIProps[];
    }

    public async getAllCurrent(): Promise<IInternshipUIProps[]>{
        const stmt = await this.unit.prepare(`select i.internship_id, i.title, c.name as "company_name", i.application_end, i.min_year, s.city || ', ' || s.address as location,
                                                                         w.name as "work_type", c.company_logo_path, id.description as "duration", i.internship_creation_timestamp as "added",
                                                                         (select count(*)
                                                                          from viewed_internships vi
                                                                          where vi.internship_id = i.internship_id) as "views", ARRAY_REMOVE(ARRAY_AGG(DISTINCT d.name), NULL) AS category,
                                                                         c.website as "company_link", i.internship_application_link as "internship_link", c.admin_verified
                                                                  from internship i
                                                                           join site s on (i.location_id = s.location_id)
                                                                           join company c on (s.company_id = c.company_id)
                                                                           join worktype w on (i.worktype_id = w.worktype_id)
                                                                           join internship_duration id on (i.internship_duration_id = id.internship_duration_id)
                                                                           left join internship_department_map idm on (i.internship_id = idm.internship_id)
                                                                           left join department d ON d.department_id = idm.department_id
                                                                  WHERE i.application_end >= CURRENT_DATE
                                                                  group by i.internship_id, i.title, c.name, i.application_end, i.min_year, location, w.name, c.company_logo_path, id.description, i.internship_creation_timestamp, c.website, i.salary, i.internship_application_link, c.company_id, c.company_info, c.admin_verified;
        `);


        return await stmt.rows as IInternshipUIProps[];
    }

    public async getAllAdminVerified(): Promise<IInternshipUIProps[]>{
        const stmt = await this.unit.prepare(`select i.internship_id, i.title, c.name as "company_name", i.application_end, i.min_year, s.city || ', ' || s.address as location,
                                                       w.name as "work_type", c.company_logo_path, id.description as "duration", i.internship_creation_timestamp as "added",
                                                       (select count(*)
                                                        from viewed_internships vi
                                                        where vi.internship_id = i.internship_id) as "views", ARRAY_REMOVE(ARRAY_AGG(DISTINCT d.name), NULL) AS category,
                                                       c.website as "company_link", i.internship_application_link as "internship_link", true as admin_verified
                                                from internship i
                                                         join site s on (i.location_id = s.location_id)
                                                         join company c on (s.company_id = c.company_id)
                                                         join worktype w on (i.worktype_id = w.worktype_id)
                                                         join internship_duration id on (i.internship_duration_id = id.internship_duration_id)
                                                         left join internship_department_map idm on (i.internship_id = idm.internship_id)
                                                         left join department d ON d.department_id = idm.department_id
                                                WHERE c.admin_verified is true
                                                group by i.internship_id, i.title, c.name, i.application_end, i.min_year, location, w.name, c.company_logo_path, id.description, i.internship_creation_timestamp, c.website, i.salary, i.internship_application_link, c.company_id, c.company_info,c.admin_verified;
                                                `);
        return stmt.rows as IInternshipUIProps[];
    }

    public async getById(id: number): Promise<IInternshipDetailsUIProps>{
        const stmt = await this.unit.prepare(`select i.internship_id, i.title, c.name as "company_name", i.application_end, i.min_year, s.city || ', ' || s.address  as location,
                                                                         w.name as "work_type", c.company_logo_path, id.description as "duration", i.internship_creation_timestamp as "added", i.pdf_path as "pdf",
                                                                         (select count(*)
                                                                          from viewed_internships vi
                                                                          where vi.internship_id = i.internship_id) as "views", ARRAY_REMOVE(ARRAY_AGG(DISTINCT d.name), NULL) AS category,
                                                                         c.website as "company_link", i.salary, i.internship_application_link as "internship_link", c.company_id, c.company_info
                                                                  from internship i
                                                                           join site s on (i.location_id = s.location_id)
                                                                           join company c on (s.company_id = c.company_id)
                                                                           join worktype w on (i.worktype_id = w.worktype_id)
                                                                           join internship_duration id on (i.internship_duration_id = id.internship_duration_id)
                                                                           left join internship_department_map idm on (i.internship_id = idm.internship_id)
                                                                           left join department d ON d.department_id = idm.department_id
                                                                  where i.internship_id = $1
                                                                  group by i.internship_id, i.title, c.name, i.application_end, i.min_year, location, w.name, c.company_logo_path, id.description, i.internship_creation_timestamp, c.website, i.salary, i.internship_application_link, c.company_id, c.company_info;
                        `, [id]);
        return stmt.rows[0] as IInternshipDetailsUIProps;
    }

    public async getByCompanyId(company_id: number): Promise<IInternshipUIProps[]> {
        const stmt = await this.unit.prepare(`select i.internship_id,
                                                     i.title,
                                                     c.name                                         as "company_name",
                                                     i.application_end,
                                                     i.min_year,
                                                     s.city || ', ' || s.address                   as location,
                                                     w.name                                         as "work_type",
                                                     c.company_logo_path,
                                                     id.description                                 as "duration",
                                                     i.internship_creation_timestamp                as "added",
                                                     (select count(*)
                                                      from viewed_internships vi
                                                      where vi.internship_id = i.internship_id)     as "views",
                                                     ARRAY_REMOVE(ARRAY_AGG(DISTINCT d.name), NULL) AS category,
                                                     c.website                                      as "company_link",
                                                     i.internship_application_link                  as "internship_link",
                                                    c.admin_verified
                                              from internship i
                                                       join site s on (i.location_id = s.location_id)
                                                       join company c on (s.company_id = c.company_id)
                                                       join worktype w on (i.worktype_id = w.worktype_id)
                                                       join internship_duration id
                                                            on (i.internship_duration_id = id.internship_duration_id)
                                                       left join internship_department_map idm on (i.internship_id = idm.internship_id)
                                                       left join department d ON d.department_id = idm.department_id
                                              where c.company_id=$1
                                              group by i.internship_id, i.title, c.name, i.application_end, i.min_year,
                                                       location, w.name, c.company_logo_path, id.description,
                                                       i.internship_creation_timestamp, c.website, i.salary,
                                                       i.internship_application_link, c.company_id, c.company_info, c.admin_verified;`, [company_id]);

        return stmt.rows as IInternshipUIProps[];
    }

    public async getIdByCompanyId(company_id: number): Promise<number[]> {
        const stmt = await this.unit.prepare(`select i.internship_id
                                              from internship i
                                              where i.location_id = ALL (select s.location_id
                                                                         from site s
                                                                         where s.company_id = (select c.company_id
                                                                                               from company c
                                                                                               where c.company_id = $1));`, [company_id]);

        return stmt.rows.map(row => row.internship_id) as number[];
    }

    public async newInternship(i: IInternship): Promise<number>{
        const stmt = await this.unit.prepare(`INSERT INTO internship (title, pdf_path, min_year, internship_creation_timestamp, salary, application_end, location_id, clicks, worktype_id, internship_duration_id, internship_application_link) 
                                                                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
                                                                   RETURNING internship_id;`
                                                            , [ i.title, i.pdf_path, i.min_year, i.internship_creation_timestamp, i.salary, i.application_end, i.location_id, i.clicks, i.worktype_id, i.internship_duration_id, i.internship_application_link]);

        const result = await stmt.rows[0];
        return result?.internship_id ?? -1;
    }

    public async updateInternship(i: IInternship): Promise<number>{
        const stmt = await this.unit.prepare(`UPDATE internship 
                                                                    set 
                                                                        title = $1,
                                                                        pdf_path = $2,
                                                                        min_year = $3,
                                                                        internship_creation_timestamp = $4,
                                                                        salary = $5,
                                                                        application_end = $6,
                                                                        location_id = $7,
                                                                        clicks = $8,
                                                                        worktype_id = $9,
                                                                        internship_duration_id = $10,
                                                                        internship_application_link = $11`
                                                            , [i.title, i.pdf_path, i.min_year, i.internship_creation_timestamp, i.salary, i.application_end, i.location_id, i.clicks, i.worktype_id, i.internship_duration_id, i.internship_application_link]);
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

    public async internshipExists(id: number): Promise<boolean> {
        const stmt = await this.unit.prepare(`select count(internship_id) from internship where internship_id=$1`, [id])
        const count: number = parseInt(stmt.rows[0].count, 10);

        return count === 1;
    }

    public async getCountCreatedTheLast30Days(): Promise<number> {
        const stmt = await this.unit.prepare(`SELECT COUNT(*)
                                                                    FROM internship
                                                                    WHERE internship_creation_timestamp >= NOW() - INTERVAL '30 days';`);
        return parseInt(stmt.rows[0].count ?? 0, 10);

    }

    public async updatePdfPath(internshipId: number, pdfPath: string): Promise<boolean> {
        const stmt = await this.unit.prepare(
            `UPDATE internship SET pdf_path = $1 WHERE internship_id = $2`,
            [pdfPath, internshipId]
        );
        return stmt.rowCount !== null ? stmt.rowCount > 0 : false;
    }

    public async getSimpleById(id: number): Promise<IInternshipId>{
        const stmt = await this.unit.prepare(`select internship_id, title, pdf_path, min_year, internship_creation_timestamp, salary, application_end, location_id, clicks, worktype_id, internship_duration_id, internship_application_link
                                                                  where i.internship_id = $1`, [id]);
        return stmt.rows[0] as IInternshipId;
    }
}