import { ServiceBase } from "./service-base.js";
import { Unit } from '../unit.js';
import { getAbsoluteURL } from '../router/company-router.js';

import { IInternship, IInternshipDetailsUIProps, IInternshipId, IInternshipUIProps } from "../model";
import { QueryResult } from "pg";

export class InternshipService extends ServiceBase {
    constructor(unit: Unit) {
        super(unit);
    }

    public async getAll(): Promise<IInternshipUIProps[]> {
        const stmt = await this.unit.prepare(`SELECT i.internship_id, i.title, c.name AS "company_name", i.application_end, i.min_year, s.city || ', ' || s.address AS location,
                                                                    w.name AS "work_type", c.company_logo_path, id.description AS "duration", i.internship_creation_timestamp AS "added",
                                                                    (SELECT count(*)
                                                                      FROM viewed_internships vi
                                                                      WHERE vi.internship_id = i.internship_id) AS "views",
                                                                    ARRAY_REMOVE(ARRAY_AGG(DISTINCT d.name), NULL) AS category,
                                                                    c.website AS "company_link", i.internship_application_link AS "internship_link", c.admin_verified
                                                                  FROM internship i
                                                                           JOIN site s                              ON (i.location_id = s.location_id)
                                                                           JOIN company c                           ON (s.company_id = c.company_id)
                                                                           JOIN worktype w                          ON (i.worktype_id = w.worktype_id)
                                                                           JOIN internship_duration id              ON (i.internship_duration_id = id.internship_duration_id)
                                                                           LEFT JOIN internship_department_map idm  ON (i.internship_id = idm.internship_id)
                                                                           LEFT JOIN department d                   ON d.department_id = idm.department_id
                                                                  GROUP BY i.internship_id, i.title, c.name, i.application_end, i.min_year, location, w.name, c.company_logo_path, id.description, i.internship_creation_timestamp, c.website, i.salary, i.internship_application_link, c.company_id, c.company_info, c.admin_verified;`);
        return await stmt.rows as IInternshipUIProps[];
    }

    public async getAllCurrent(): Promise<IInternshipUIProps[]> {
        const stmt = await this.unit.prepare(`select i.internship_id, i.title, c.name AS "company_name", i.application_end, i.min_year, s.city || ', ' || s.address AS location,
                                                                    w.name AS "work_type", c.company_logo_path, id.description AS "duration", i.internship_creation_timestamp AS "added",
                                                                    (select count(*)
                                                                     from viewed_internships vi
                                                                     where vi.internship_id = i.internship_id) AS "views", 
                                                                    ARRAY_REMOVE(ARRAY_AGG(DISTINCT d.name), NULL) AS category,
                                                                    c.website as "company_link", i.internship_application_link AS "internship_link", c.admin_verified
                                                                  FROM internship i
                                                                           JOIN site s                              ON (i.location_id = s.location_id)
                                                                           JOIN company c                           ON (s.company_id = c.company_id)
                                                                           JOIN worktype w                          ON (i.worktype_id = w.worktype_id)
                                                                           JOIN internship_duration id              ON (i.internship_duration_id = id.internship_duration_id)
                                                                           LEFT JOIN internship_department_map idm  ON (i.internship_id = idm.internship_id)
                                                                           LEFT JOIN department d                   ON d.department_id = idm.department_id
                                                                  WHERE i.application_end >= CURRENT_DATE
                                                                  GROUP BY i.internship_id, i.title, c.name, i.application_end, i.min_year, location, w.name, c.company_logo_path, id.description, i.internship_creation_timestamp, c.website, i.salary, i.internship_application_link, c.company_id, c.company_info, c.admin_verified;
        `);


        return await stmt.rows as IInternshipUIProps[];
    }

    public async getAllAdminVerified(): Promise<IInternshipUIProps[]> {
        const stmt = await this.unit.prepare(`SELECT 
                                                                    i.internship_id, 
                                                                    i.title, 
                                                                    c.name                                          AS "company_name", 
                                                                    i.application_end, 
                                                                    i.min_year, s.city || ', ' || s.address         AS location,
                                                                    w.name                                          AS "work_type", 
                                                                    c.company_logo_path, 
                                                                    id.description AS "duration", 
                                                                    i.internship_creation_timestamp                 AS "added",
                                                                    (SELECT count(*)
                                                                     FROM viewed_internships vi
                                                                     WHERE vi.internship_id = i.internship_id)      AS "views",
                                                                    ARRAY_REMOVE(ARRAY_AGG(DISTINCT d.name), NULL)  AS category,
                                                                    c.website                                       AS "company_link", 
                                                                    i.internship_application_link                   AS "internship_link", 
                                                                    true                                            AS admin_verified
                                                FROM internship i
                                                         JOIN site s                                ON (i.location_id = s.location_id)
                                                         JOIN company c                             ON (s.company_id = c.company_id)
                                                         JOIN worktype w                            ON (i.worktype_id = w.worktype_id)
                                                         JOIN internship_duration id                ON (i.internship_duration_id = id.internship_duration_id)
                                                         LEFT JOIN internship_department_map idm    ON (i.internship_id = idm.internship_id)
                                                         LEFT JOIN department d                     ON d.department_id = idm.department_id
                                                WHERE c.admin_verified is true
                                                GROUP BY i.internship_id, i.title, c.name, i.application_end, i.min_year, location, w.name, c.company_logo_path, id.description, i.internship_creation_timestamp, c.website, i.salary, i.internship_application_link, c.company_id, c.company_info,c.admin_verified;
                                                `);
        return stmt.rows as IInternshipUIProps[];
    }

    public async getById(id: number): Promise<IInternshipDetailsUIProps> {
        const stmt = await this.unit.prepare(`SELECT
                                                                    i.internship_id, 
                                                                    i.title, c.name                                 AS "company_name", 
                                                                    i.application_end, 
                                                                    i.min_year, 
                                                                    s.city || ', ' || s.address                     AS location,
                                                                    w.name                                          AS "work_type", 
                                                                    c.company_logo_path, 
                                                                    id.description                                  AS "duration", 
                                                                    i.internship_creation_timestamp                 AS "added", 
                                                                    i.pdf_path                                      AS "pdf",
                                                                    (SELECT count(*)
                                                                     FROM viewed_internships vi
                                                                     WHERE vi.internship_id = i.internship_id)      AS "views", 
                                                                    ARRAY_REMOVE(ARRAY_AGG(DISTINCT d.name), NULL)  AS category,
                                                                    c.website                                       AS "company_link", 
                                                                    i.salary, i.internship_application_link         AS "internship_link", 
                                                                    c.company_id, 
                                                                    c.company_info,
                                                                    s.location_id
                                                                  FROM internship i
                                                                           JOIN site s                              ON (i.location_id = s.location_id)
                                                                           JOIN company c                           ON (s.company_id = c.company_id)
                                                                           JOIN worktype w                          ON (i.worktype_id = w.worktype_id)
                                                                           JOIN internship_duration id              ON (i.internship_duration_id = id.internship_duration_id)
                                                                           LEFT JOIN internship_department_map idm  ON (i.internship_id = idm.internship_id)
                                                                           LEFT JOIN department d                   ON d.department_id = idm.department_id
                                                                  WHERE i.internship_id = $1
                                                                  GROUP BY i.internship_id, i.title, c.name, i.application_end, i.min_year, location, w.name, c.company_logo_path, id.description, i.internship_creation_timestamp, c.website, i.salary, i.internship_application_link, c.company_id, c.company_info, s.location_id, i.pdf_path;
                        `, [id]);
        return stmt.rows[0] as IInternshipDetailsUIProps;
    }

    public async getByCompanyId(company_id: number): Promise<IInternshipUIProps[]> {
        const stmt = await this.unit.prepare(`SELECT i.internship_id,
                                                                     i.title,
                                                                     c.name                                         AS "company_name",
                                                                     i.application_end,
                                                                     i.min_year,
                                                                     s.city || ', ' || s.address                    AS location,
                                                                     w.name                                         AS "work_type",
                                                                     c.company_logo_path,
                                                                     id.description                                 AS "duration",
                                                                     i.internship_creation_timestamp                AS "added",
                                                                     (SELECT count(*)
                                                                      FROM viewed_internships vi
                                                                      WHERE vi.internship_id = i.internship_id)     AS "views",
                                                                     ARRAY_REMOVE(ARRAY_AGG(DISTINCT d.name), NULL) AS category,
                                                                     c.website                                      AS "company_link",
                                                                     i.internship_application_link                  AS "internship_link",
                                                                    c.admin_verified
                                                              FROM internship i
                                                                       JOIN site s                              ON (i.location_id = s.location_id)
                                                                       JOIN company c                           ON (s.company_id = c.company_id)
                                                                       JOIN worktype w                          ON (i.worktype_id = w.worktype_id)
                                                                       JOIN internship_duration id              ON (i.internship_duration_id = id.internship_duration_id)
                                                                       LEFT JOIN internship_department_map idm  ON (i.internship_id = idm.internship_id)
                                                                       LEFT JOIN department d                   ON d.department_id = idm.department_id
                                                              WHERE c.company_id=$1
                                                              GROUP BY i.internship_id, i.title, c.name, i.application_end, i.min_year,
                                                                       location, w.name, c.company_logo_path, id.description,
                                                                       i.internship_creation_timestamp, c.website, i.salary,
                                                                       i.internship_application_link, c.company_id, c.company_info, c.admin_verified;`, [company_id]);

        return stmt.rows as IInternshipUIProps[];
    }

    public async getIdByCompanyId(company_id: number): Promise<number[]> {
        const stmt = await this.unit.prepare(`SELECT i.internship_id
                                                                    FROM internship i
                                                                    WHERE i.location_id = ALL (SELECT s.location_id
                                                                                                FROM site s
                                                                                                WHERE s.company_id = (SELECT c.company_id
                                                                                                                       FROM company c
                                                                                                                       WHERE c.company_id = $1));`, [company_id]);

        return stmt.rows.map(row => row.internship_id) as number[];
    }

    public async newInternship(i: IInternship): Promise<number> {
        i.internship_application_link = getAbsoluteURL(i.internship_application_link);
        const stmt = await this.unit.prepare(`INSERT INTO internship (title, pdf_path, min_year, internship_creation_timestamp, salary, application_end, location_id, worktype_id, internship_duration_id, internship_application_link) 
                                                                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
                                                                   RETURNING internship_id;`
            , [i.title, i.pdf_path, i.min_year, i.internship_creation_timestamp, i.salary, i.application_end, i.location_id, i.worktype_id, i.internship_duration_id, i.internship_application_link]);

        const result = await stmt.rows[0];
        return result?.internship_id ?? -1;
    }

    public async updateInternship(i: IInternship, id: number): Promise<number> {
        i.internship_application_link = getAbsoluteURL(i.internship_application_link);
        const stmt = await this.unit.prepare(`UPDATE internship 
                                                                    SET 
                                                                        title = $1,
                                                                        min_year = $2,
                                                                        internship_creation_timestamp = $3,
                                                                        salary = $4,
                                                                        application_end = $5,
                                                                        location_id = $6,
                                                                        worktype_id = $7,
                                                                        internship_duration_id = $8,
                                                                        internship_application_link = $9
                                                                    WHERE internship_id=$10
                                                                    RETURNING internship_id`
            , [i.title, i.min_year, i.internship_creation_timestamp, i.salary, i.application_end, i.location_id, i.worktype_id, i.internship_duration_id, i.internship_application_link, id]);
        const result = await stmt.rows[0];
        return result?.internship_id ?? -1;
    }

    public async deleteInternship(id: number): Promise<number> {
        const stmt = await this.unit.prepare(`DELETE FROM internship 
                                                                   WHERE internship_id = $1
                                                                   RETURNING internship_id`
            , [id]);
        const result = await stmt.rows[0];
        return result?.internship_id ?? -1;
    }

    public async internshipExists(id: number): Promise<boolean> {
        const stmt = await this.unit.prepare(`SELECT count(internship_id) 
                                                                    FROM internship 
                                                                    WHERE internship_id=$1`, [id])
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

    public async getSimpleById(id: number): Promise<IInternshipId> {
        const stmt = await this.unit.prepare(`SELECT internship_id, title, pdf_path, min_year, internship_creation_timestamp, salary, application_end, location_id, clicks, worktype_id, internship_duration_id, internship_application_link
                                                                    FROM internship
                                                                  WHERE internship_id = $1`, [id]);
        return stmt.rows[0] as IInternshipId;
    }

    public async getInternshipsWhichExpired(): Promise<number[]> {
        const stmt = await this.unit.prepare(`SELECT internship_id, (application_end + INTERVAL '30 days'), NOW()
                                                                    FROM internship
                                                                    WHERE (application_end + INTERVAL '30 days') <= NOW();`);
        return stmt.rows as number[];
    }
}