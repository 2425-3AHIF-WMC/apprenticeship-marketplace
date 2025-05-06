import {PoolClient, Pool, QueryResult} from 'pg';

const pool = new Pool({
    user: "postgres",
    host: "postgres",
    database: "cruddb",
    password: "postgres",
    port: 5432,
});

export class Unit {
    private readonly readOnly: boolean;
    private completed = false;
    private client: PoolClient;

    private constructor(readOnly: boolean, client: PoolClient) {
        this.readOnly = readOnly;
        this.client = client;
    }

    static async create(readOnly: boolean): Promise<Unit> {
        const client = await pool.connect();
        if (!readOnly) await client.query('BEGIN');
        if (!readOnly) {
            await ensureTablesCreated();
        }
        return new Unit(readOnly, client);

    }

    async prepare(sql: string, bindings: any[] = []): Promise<QueryResult> {
        return this.client.query(sql, bindings);
    }

    async getLastRowId(): Promise<number> {
        const result = await this.client.query('SELECT LASTVAL()');
        return result.rows[0].lastval;
    }

    async complete(commit: boolean | null = null): Promise<void> {
        if (this.completed) return;
        this.completed = true;

        if (commit !== null) {
            await this.client.query(commit ? 'COMMIT' : 'ROLLBACK');
        } else if (!this.readOnly) {
            throw new Error("Transaction opened but no commit/rollback specified.");
        }
        this.client.release();
    }
}

export async function ensureTablesCreated(): Promise<void> {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS person (
            person_id SERIAL NOT NULL,
            username VARCHAR(50) NOT NULL,
            added TIMESTAMP NOT NULL,
            persontype VARCHAR(7) NOT NULL,
            CONSTRAINT pk_person PRIMARY KEY (person_id),
            CONSTRAINT chk_persontype CHECK (persontype IN ('Admin', 'Person', 'Student'))
            );

        CREATE TABLE IF NOT EXISTS student (
            student_id INTEGER NOT NULL,
            CONSTRAINT pk_student PRIMARY KEY (student_id),
            CONSTRAINT fk_student_person FOREIGN KEY (student_id)
            REFERENCES person(person_id)
            );

        CREATE TABLE IF NOT EXISTS admin (
            admin_id INTEGER NOT NULL,
            CONSTRAINT pk_admin PRIMARY KEY (admin_id),
            CONSTRAINT fk_admin_person FOREIGN KEY (admin_id)
            REFERENCES person(person_id)
            );

        CREATE TABLE IF NOT EXISTS city (
            plz INTEGER,
            name VARCHAR(50) NOT NULL,
            CONSTRAINT pk_city PRIMARY KEY (plz),
            CONSTRAINT chk_plz CHECK (plz >= 1000 AND plz <= 9999)
            );

        CREATE TABLE IF NOT EXISTS company (
            company_id INTEGER NOT NULL,
            name VARCHAR(50) NOT NULL,
            company_info VARCHAR(30) NOT NULL,
            website VARCHAR(30) NOT NULL,
            email VARCHAR(50) NOT NULL,
            phone_number VARCHAR(15) NOT NULL,
            password VARCHAR(50) NOT NULL,
            email_verified BOOLEAN NOT NULL,
            admin_verified BOOLEAN NOT NULL,
            CONSTRAINT pk_company PRIMARY KEY (company_id)
            );

        CREATE TABLE IF NOT EXISTS department (
            department_id SMALLINT NOT NULL,
            name VARCHAR(50),
            CONSTRAINT pk_department PRIMARY KEY (department_id)
            );

        CREATE TABLE IF NOT EXISTS site (
            location_id SMALLINT NOT NULL,
            address VARCHAR(30) NOT NULL,
            name VARCHAR(50),
            company_id INTEGER,
            plz INTEGER,
            CONSTRAINT pk_site PRIMARY KEY (location_id),
            CONSTRAINT fk_site_company FOREIGN KEY (company_id)
            REFERENCES company(company_id),
            CONSTRAINT fk_site_city FOREIGN KEY (plz)
            REFERENCES city(plz)
            );

        CREATE TABLE IF NOT EXISTS worktype (
            worktype_id INTEGER NOT NULL,
            name VARCHAR(50) NOT NULL,
            description VARCHAR(50),
            CONSTRAINT pk_worktype PRIMARY KEY (worktype_id)
            );

        CREATE TABLE IF NOT EXISTS internshipduration (
            internshipduration_id INTEGER NOT NULL,
            description VARCHAR(50) NOT NULL,
            CONSTRAINT pk_internshipduration PRIMARY KEY (internshipduration_id)
            );

        CREATE TABLE IF NOT EXISTS internship (
            internship_id SMALLINT NOT NULL,
            title VARCHAR(50) NOT NULL,
            description VARCHAR(50) NOT NULL,
            workplace VARCHAR(50) NOT NULL,
            min_year SMALLINT,
            added TIMESTAMP NOT NULL,
            salary NUMERIC(6,2) NOT NULL,
            application_end DATE NOT NULL,
            location_id SMALLINT,
            clicks INTEGER NOT NULL,
            worktype_id INTEGER,
            internshipduration_id INTEGER,
            CONSTRAINT pk_internship PRIMARY KEY (internship_id),
            CONSTRAINT fk_internship_site FOREIGN KEY (location_id)
            REFERENCES site(location_id),
            CONSTRAINT fk_internship_worktype FOREIGN KEY (worktype_id)
            REFERENCES worktype(worktype_id),
            CONSTRAINT fk_internship_duration FOREIGN KEY (internshipduration_id)
            REFERENCES internshipduration(internshipduration_id)
            );

        CREATE TABLE IF NOT EXISTS favourite (
            favourite_id SMALLINT NOT NULL,
            student_id INTEGER,
            added TIMESTAMP,
            internship_id SMALLINT,
            CONSTRAINT pk_favourite PRIMARY KEY (favourite_id),
            CONSTRAINT fk_fav_student FOREIGN KEY (student_id)
            REFERENCES student(student_id),
            CONSTRAINT fk_fav_internship FOREIGN KEY (internship_id)
            REFERENCES internship(internship_id)
            );

        CREATE TABLE IF NOT EXISTS internship_department_map (
            internship_id SMALLINT NOT NULL,
            department_id SMALLINT NOT NULL,
            CONSTRAINT pk_internship_dept_map PRIMARY KEY (internship_id, department_id),
            CONSTRAINT fk_map_internship FOREIGN KEY (internship_id)
            REFERENCES internship(internship_id),
            CONSTRAINT fk_map_department FOREIGN KEY (department_id)
            REFERENCES department(department_id)
            );

        CREATE TABLE IF NOT EXISTS viewedinternships (
            student_id INTEGER NOT NULL,
            internship_id SMALLINT NOT NULL,
            viewdate TIMESTAMP NOT NULL,
            CONSTRAINT pk_viewedinternships PRIMARY KEY (student_id, internship_id),
            CONSTRAINT fk_view_student FOREIGN KEY (student_id)
            REFERENCES student(student_id),
            CONSTRAINT fk_view_internship FOREIGN KEY (internship_id)
            REFERENCES internship(internship_id)
            );
    `);
}
