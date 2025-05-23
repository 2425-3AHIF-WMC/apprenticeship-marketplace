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

export interface IInternship{
    title: String;
    company_name: String;
    application_end: Date;
    min_year: number;
    department: String;
    site: String;
    work_type: String;
    company_logo: String;
    duration: String;
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