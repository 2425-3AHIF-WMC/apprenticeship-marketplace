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

export async function insertSampleData(unit: Unit): Promise<void> {

    const tables: string[] = ["worktype", "internshipduration", "city", "company", "site", "internship"];

    async function dataPresent(table: string): Promise<boolean> {
        const chkStmt = await unit.prepare('select count(*) as "count" from ?1');
        const result: number = chkStmt.rows[0].count;
        return result > 0;
    }

    async function insert(): Promise<void> {
        await pool.query(`
        INSERT INTO WorkType (id, name, description) VALUES
        (1, 'Hybrid', 'keine Arbeit aus dem Homeoffice möglich'),
        (2, 'On-Site', 'teilweise Arbeit aus dem Homeoffice möglich'),
        (3, 'Remote', 'Arbeit aus dem Homeoffice möglich');
        
        INSERT INTO InternshipDuration (id, description) VALUES
        (1, '4 Wochen'),
        (2, '8 Wochen'),
        (3, 'variabel');
        
        INSERT INTO City (plz, name) VALUES
        (1010, 'Wien'),
        (4020, 'Linz'),
        (5020, 'Salzburg'),
        (8010, 'Graz'),
        (6020, 'Innsbruck'),
        (3100, 'St. Pölten'),
        (9020, 'Klagenfurt');
        
        -- Firmen
        INSERT INTO Company (company_id, name, company_info, website, email, phone_number, password, email_verified, admin_verified) VALUES
        (1, 'TechNova GmbH', 'Innovative IT Lösungen', 'https://technova.at', 'info@technova.at', '015123456', 'pass123', 'Y', 'Y'),
        (2, 'GreenFuture AG', 'Nachhaltige Energiekonzepte', 'https://greenfuture.at', 'kontakt@greenfuture.at', '0732123456', 'pass123', 'Y', 'Y'),
        (3, 'MediCare Solutions', 'Digitale Gesundheitstechnologien', 'https://medicare.at', 'service@medicare.at', '0664123456', 'pass123', 'Y', 'Y'),
        (4, 'EduLearn GmbH', 'E-Learning Plattformen', 'https://edulearn.at', 'support@edulearn.at', '0316123456', 'pass123', 'Y', 'Y'),
        (5, 'AutoDrive AG', 'Autonomes Fahren', 'https://autodrive.at', 'team@autodrive.at', '0512123456', 'pass123', 'Y', 'Y'),
        (6, 'BuildTech', 'Smart Building Lösungen', 'https://buildtech.at', 'contact@buildtech.at', '0276123456', 'pass123', 'Y', 'Y'),
        (7, 'DataOcean GmbH', 'Big Data Analyse', 'https://dataocean.at', 'hello@dataocean.at', '0463123456', 'pass123', 'Y', 'Y');
        
        -- Standorte
        INSERT INTO Site (location_id, address, name, company_id, plz) VALUES
        (1, 'Kärntner Straße 1', 'TechNova HQ', 1, 1010),
        (2, 'Landstraße 10', 'GreenFuture Oberösterreich', 2, 4020),
        (3, 'Getreidegasse 3', 'MediCare Zentrum', 3, 5020),
        (4, 'Herrengasse 5', 'EduLearn Graz', 4, 8010),
        (5, 'Maria-Theresien-Straße 7', 'AutoDrive West', 5, 6020),
        (6, 'Wiener Straße 12', 'BuildTech Niederösterreich', 6, 3100),
        (7, 'Neuer Platz 1', 'DataOcean Süd', 7, 9020);
        
        -- Praktika
        INSERT INTO Internship (internship_id, title, description, min_year, added, salary, application_end, location_id, clicks, id, id1) VALUES
        (1, 'Softwareentwickler Praktikum', 'C#/.NET Entwicklung', 2, NOW(), 800.00, '2025-06-30', 1, 12, 1, 1),
        (2, 'Frontend Entwickler', 'React.js Projektarbeit', 3, NOW(), 850.00, '2025-07-15', 2, 5, 2, 2),
        (3, 'Data Analyst Praktikum', 'Analyse großer Datensätze mit Python', 2, NOW(), 900.00, '2025-06-10', 7, 9, 1, 1),
        (4, 'Marketing Assistant', 'Unterstützung bei Online-Kampagnen', 1, NOW(), 750.00, '2025-06-01', 4, 7, 2, 3),
        (5, 'Health App Tester', 'Usability-Tests von mobilen Anwendungen', 3, NOW(), 700.00, '2025-06-20', 3, 4, 1, 1),
        (6, 'E-Learning Content Creator', 'Multimedia-Inhalte entwickeln', 2, NOW(), 800.00, '2025-07-01', 4, 3, 2, 2),
        (7, 'Fahrzeugsimulation Praktikum', 'Simulation autonomer Fahrzeuge', 4, NOW(), 1000.00, '2025-07-10', 5, 6, 1, 2),
        (8, 'Smart Building Testing', 'IoT-Sensorik evaluieren', 2, NOW(), 850.00, '2025-07-05', 6, 2, 2, 3),
        (9, 'Machine Learning Assistant', 'Modelle für Vorhersagen trainieren', 3, NOW(), 950.00, '2025-08-01', 7, 8, 1, 1),
        (10, 'Webdesign Praktikum', 'Mitarbeit an responsiven Layouts', 1, NOW(), 700.00, '2025-06-25', 2, 4, 2, 2),
        (11, 'Backoffice Assistant', 'Dokumentenmanagement und Kommunikation', 2, NOW(), 650.00, '2025-06-15', 1, 2, 1, 3),
        (12, 'UX Research Praktikum', 'Interviews und Nutzeranalysen', 3, NOW(), 800.00, '2025-07-20', 3, 5, 1, 2),
        (13, 'Energieoptimierung Praktikum', 'Auswertung von Verbrauchsdaten', 2, NOW(), 850.00, '2025-07-30', 2, 3, 2, 1),
        (14, 'Cloud Infrastruktur Praktikum', 'Arbeiten mit AWS und Docker', 3, NOW(), 1000.00, '2025-08-10', 7, 6, 1, 3),
        (15, 'Technischer Redakteur', 'Erstellen technischer Dokumentationen', 1, NOW(), 700.00, '2025-06-22', 6, 2, 2, 2),
        (16, 'App-Entwicklung iOS', 'Swift und Xcode kennenlernen', 3, NOW(), 900.00, '2025-07-05', 3, 3, 1, 1),
        (17, 'DevOps Intern', 'CI/CD Pipelines automatisieren', 4, NOW(), 950.00, '2025-08-15', 5, 7, 1, 2),
        (18, 'CRM Kampagnen', 'Salesforce nutzen und pflegen', 2, NOW(), 800.00, '2025-06-18', 4, 5, 2, 2),
        (19, 'Security Audit Support', 'Penetration Testing und Berichte', 3, NOW(), 950.00, '2025-07-28', 1, 6, 1, 1),
        (20, 'SEO Praktikum', 'Optimierung von Webseiten', 1, NOW(), 750.00, '2025-06-30', 2, 4, 2, 3);
        `)
    }

    for (let i = 0; i < tables.length; i++) {
        if(await dataPresent(tables[i])){
            return;
        }
    }
    await insert();
}