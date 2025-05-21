//TODO: Interface für jede Tabelle die wir brauchen

export interface IStudent{
    studentId: string;
    username: string;
    added: Date;
    personType: string;
}

export interface IInternshipDetailed{
    id: number;
    department: string[];
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

export interface IInternship{
    id: number;
    title: string;
    company_name: string;
    application_end: Date;
    min_year: number;
    department: string[];
    site: string;
    work_type: string;
    company_logo: string;
    duration: string;
}

export interface ICompany {
    company_id: number,
    name: string,
    company_info: string,
    website: string,
    email: string
    phone_number : string,
    password: string,
    email_verified: string,
    admin_verified: string
}