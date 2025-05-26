import {ServiceBase} from "./service-base.js";
import {Unit} from '../unit.js';
import {IStudent, PersonType} from "../model.js";

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
}