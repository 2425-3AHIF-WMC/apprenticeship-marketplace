//TODO: Interface für jede Tabelle die wir brauchen

export interface IStudent{
    studentId: string;
    username: string;
    added: Date;
    personType: string;
}

export interface IInternshipDetailed{
    department: string;
    site: string;
    duration: string;
    description: string;
    salary: number;
    application_end: Date;
    min_year: number;
    work_type: string;
    title: string;
    company_name: string;
    company_info: string;
    company_logo: string;
}