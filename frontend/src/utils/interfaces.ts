// Frontend interfaces matching backend/src/model.ts

export interface Student {
    person_id: string;
    username: string;
    email: string;
    person_creation_timestamp: string; // ISO date string
    personType: string;
}

// --- Frontend UI interfaces (for props, cards, etc.) ---
// These may differ from backend models and are used for UI components only.

export interface InternshipUIProps {
    id: string;
    title: string;
    company_name: string;
    application_end: string; // ISO date string
    min_year: string;
    location: string;
    work_type: string;
    company_logo: string;
    duration: string;
    added: string;
    views: number;
    department: string[];
    company_link: string;
    internship_link: string;
    admin_verified: boolean;

}

export interface IInternshipId {
    internship_id: string,
    title: string,
    pdf_path: string | null,
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


export interface InternshipDetailsUIProps {
    id: string;
    title: string;
    company_name: string;
    application_end: string; // ISO date string
    min_year: string;
    location: string;
    work_type: string;
    company_logo: string;
    duration: string;
    added: string;
    views: number;
    category: string[];
    company_link: string;
    salary: string;
    internship_link: string;
    company_id: string;
    company_info: string;
    pdf: string;
    location_id: string;
}

export interface InternshipMappedProps extends Omit<InternshipUIProps, 'department' | 'id'> {
    category: string[];
    internship_id: string;
}


export interface CompanyUIPropsAdmin {
    company_id: number;
    name: string;
    company_info: string;
    website: string;
    email: string;
    phone_number: string;
    password: string;
    email_verified: boolean;
    admin_verified: boolean;
    company_registration_timestamp: string; // ISO date string
    email_verification_timestamp: string; // ISO date string
    admin_verification_timestamp: string; // ISO date string
    company_logo: string;
    company_number: string;
    internships: number[];
}

export interface CompanyUIProps {
    company_id: number;
    company_name: string;
    company_info: string;
    website: string;
    email: string;
    phone_number: string;
    password: string;
    company_logo: string;
    company_number: string;
    internships: number[];
}

export interface ICompanyPayload {
    company_id: number,
    email_verified: boolean,
    admin_verified: boolean
}

// Site Interface
export interface ISite {
    location_id: number,
    address: string,
    name: string,
    company_id: number,
    plz: number,
    city : string
}