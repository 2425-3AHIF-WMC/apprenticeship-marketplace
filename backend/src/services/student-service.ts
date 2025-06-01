import {ServiceBase} from "./service-base.js";
import {Unit} from '../unit.js';
import {IInternshipUIProps, IStudent, PersonType} from "../model.js";

export class StudentService extends ServiceBase{
    constructor(unit: Unit) {
        super(unit);
    }

    public async getAll(): Promise<IStudent[]> {
        const stmt = await this.unit.prepare(`select person_id, username, person_creation_timestamp, persontype from person where persontype = 'Student'`);
        return stmt.rows as IStudent[];
    }

    public async getById(id: number): Promise<IStudent>{
        const stmt = await this.unit.prepare("select person_id, username, person_creation_timestamp, persontype from person where person_id=$1 and persontype = 'Student'", [id]);
        return stmt.rows[0] as IStudent;
    }

    public async getAllFavourites(id: number): Promise<number[]> {
        const stmt = await this.unit.prepare(
            `SELECT array_agg(internship_id) FROM favourite WHERE student_id = $1`,
            [id]
        );

        return stmt.rows[0].array_agg ?? [];
    }

    public async getAllDetailedFavourites(id: number): Promise<IInternshipUIProps>{
        const stmt = await this.unit.prepare(`
            select i.internship_id, i.title, c.name as "company_name", i.application_end, i.min_year, ci.name || ', ' || s.address as location,
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
                    join favourite f on (i.internship_id = f.internship_id)
                    join student st on (st.student_id = f.student_id)
            where st.student_id = 1
            group by i.internship_id, i.title, c.name, i.application_end, i.min_year, location, w.name, c.company_logo, id.description, i.internship_creation_timestamp, c.website, i.salary, i.internship_application_link, c.company_id, c.company_info;
        `);

        return stmt.rows[0] as IInternshipUIProps;
    }

    public async insert(username: string): Promise<boolean> {
        const stmt =  await this.unit.prepare(
            ` WITH new_person AS (
              INSERT
              INTO person (username, person_creation_timestamp, persontype)
              VALUES ($1, NOW(), $2)
                  RETURNING person_id
                  )

              INSERT
              INTO student (student_id)
            SELECT person_id
            FROM new_person;`, [username, PersonType.Student]);

        return stmt.rowCount !== null ? stmt.rowCount > 0 : false;
    }

    public async delete(id: number): Promise<boolean> {
        const stmt = await this.unit.prepare(`DELETE FROM person WHERE person_id=$1`, [id]);
        return stmt.rowCount !== null ? stmt.rowCount > 0 : false;
    }

    public async studentExists(id: number): Promise<boolean> {
        const stmt = await this.unit.prepare(`select count(student_id) from student where student_id=$1`, [id])
        const count: number = parseInt(stmt.rows[0].count, 10);

        return count === 1;
    }

    public async studentExistsByUser(username: string): Promise<boolean> {
        const stmt = await this.unit.prepare(`select count(person_id) from person where username=$1 and persontype=$2`, [username, PersonType.Student]);
        const count: number = parseInt(stmt.rows[0].count, 10);

        return count === 1;
    }
}