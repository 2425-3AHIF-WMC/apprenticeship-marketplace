// Interfaces ------------------------------------------------------------------------------------------------------

//Student Interfaces
export interface IStudent {
    studentId: string;
    username: string;
    added: Date;
    personType: string;
}

//----------------------------------
//Internship Interfaces

export interface IFavourite{
    student_id: string;
    internship_id: string;
    added: Date;
}

//----------------------------------
//Internship Interfaces
export interface IInternshipUIProps {
    id: string;
    title: string;
    company_name: string;
    application_end: string; // ISO date string
    min_year: string;
    location: string;
    work_type: string;
    company_logo_path: string;
    duration: string;
    added: string;
    views: number;
    category: string[];
    company_link: string;
    internship_link: string;
    admin_verified: boolean;
}

export interface IInternshipDetailsUIProps {
    id: string;
    title: string;
    company_name: string;
    application_end: string; // ISO date string
    min_year: string;
    location: string;
    work_type: string;
    company_logo_path: string;
    duration: string;
    added: string;
    views: number;
    category: string[];
    company_link: string;
    salary: string;
    internship_link: string;
    company_id: string;
    company_info: string;
    pdf_path: string;
}

export interface IInternship{
    title: string,
    pdf_path: string,
    min_year: string,
    internship_creation_timestamp: string,
    salary: string,
    application_end: string,
    location_id: string,
    clicks: string,
    worktype_id: string,
    internship_duration_id: string,
    internship_application_link: string;
}

export interface IInternshipId {
    internship_id: string,
    title: string,
    pdf_path: string,
    min_year: string,
    internship_creation_timestamp: string,
    salary: string,
    application_end: string,
    location_id: string,
    clicks: string,
    worktype_id: string,
    internship_duration_id: string,
    internship_application_link: string;
}

//----------------------------------
// Company Interfaces
export interface CompanyUIPropsAdmin {
    id: string;
    name: string;
    email: string;
    website: string;
    phone_number: string;
    email_verified: boolean;
    admin_verified: boolean;
    logo: string;
}

export interface ICompany {
    company_id: number,
    name: string,
    company_number: string,
    company_info: string,
    website: string,
    email: string,
    phone_number : string,
    password: string,
    email_verified: string,
    admin_verified: string,
    company_registration_timestamp: Date,
    email_verification_timestamp: Date | null,
    admin_verification_timestamp: Date | null,
    company_logo_path: string | null
}

export interface ICompanySmall {
    company_id: number,
    name: string,
    email:string
    admin_verified: string
}

export interface ICompanyPayload {
    company_id: number,
    email_verified: string,
    admin_verified: string
}

export interface ISite {
    location_id: number,
    address: string,
    name: string,
    company_id: number,
    plz: number
}

// Worktype Interface
export interface IWorktype {
    worktype_id: number,
    name: string,
    description: string,
}

// InternshipDuration Interface
export interface IInternShipDuration {
    internship_duration_id : number,
    description : string
}

// Enums --------------------------------------------------------------------------------------------------------------

export enum PersonType {
    Admin="Admin",
    Person="Person",
    Student="Student"
}

// Functions ---------------------------------------------------------------------------------------------------------

export function isValidId(id: number): boolean {
    return !isNaN(id) && id > 0 && id !== null && id !== undefined;
}

export function isValidDate(date: Date): boolean {
    return date.toString() !== 'Invalid Date';
}