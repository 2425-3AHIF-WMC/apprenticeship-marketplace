//TODO: Interface für jede Tabelle die wir brauchen

export interface IStudent{
    studentId: string;
    username: string;
    added: Date;
    personType: string;
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