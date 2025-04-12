import { PoolClient, Pool } from 'pg';

const pool = new Pool({
    user: "postgres",
    host: "postgres",
    database: "cruddb",
    password: "password",
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
        return new Unit(readOnly, client);
    }

    async prepare(sql: string, bindings: any[] = []): Promise<any> {
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
        CREATE TABLE IF NOT EXISTS company (
            register_id  INTEGER NOT PRIMARY KEY NULL,
            name         TEXT NOT NULL,
            company_info TEXT NOT NULL,
            website      TEXT NOT NULL,
            email        TEXT NOT NULL,
            phone_number TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS department (
            department_id INTEGER PRIMARY KEY NOT NULL,
            name          TEXT
        );


        CREATE TABLE IF NOT EXISTS favourite (
            favourite_id              INTEGER PRIMARY KEY NOT NULL,
            student_username          TEXT,
            student_studentid         INTEGER,
            added                     TIMESTAMPTZ,
            internship_internship_id1 INTEGER
        );


        CREATE TABLE IF NOT EXISTS internship (
            company_registerid INTEGER,
            title              TEXT NOT NULL,
            description        TEXT NOT NULL,
            workplace          TEXT NOT NULL,
            schoolyear         INTEGER,
            added              TIMESTAMPTZ NOT NULL,
            payment            MONEY NOT NULL,
            application_end    DATE NOT NULL,
            internship_id1     INTEGER PRIMARY KEY NOT NULL
        );


        CREATE TABLE IF NOT EXISTS internship_department (
            internship_internship_id1 INTEGER NOT NULL,
            department_department_id  INTEGER NOT NULL,
            PRIMARY KEY(internship_internship_id1, department_department_id)
        );


        CREATE TABLE IF NOT EXISTS location (
            address            TEXT NOT NULL,
            name               TEXT,
            location_id        INTEGER PRIMARY KEY NOT NULL,
            company_registerid INTEGER
        );


        CREATE TABLE IF NOT EXISTS student (
            username       TEXT NOT NULL,
            added          TIMESTAMPTZ NOT NULL,
            studentid      INTEGER PRIMARY KEY NOT NULL,
            password_hash  TEXT NOT NULL,
            password_hash2 TEXT NOT NULL
        );
    `);
}
