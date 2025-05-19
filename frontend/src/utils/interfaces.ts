// Frontend interfaces matching backend/src/model.ts

export interface Student {
    studentId: string;
    username: string;
    added: string; // ISO date string
    personType: string;
}

export interface InternshipDetailed {
    department: string;
    site: string;
    duration: string;
    description: string;
    salary: number;
    application_end: string; // ISO date string
    min_year: number;
    work_type: string;
    title: string;
    company_name: string;
    company_info: string;
    company_logo: string;
}

export interface Internship {
    title: string;
    company_name: string;
    application_end: string; // ISO date string
    min_year: number;
    department: string;
    site: string;
    work_type: string;
    company_logo: string;
    duration: string;
}

export interface Company {
    company_id: number;
    name: string;
    company_info: string;
    website: string;
    email: string;
    phone_number: string;
    password: string;
    email_verified: boolean;
    admin_verified: boolean;
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
    clicks: number;
    category: string[];
    company_link: string;
}
export interface InternshipProps {
    id: string;
    title: string;
    company: string;
    location: string;
    duration: string;
    deadline: string;
    workMode: string;
    logo?: string;
    category: string[];
    schoolYear?: string;
    companyLink: string;
    added: string;
    clicks: number;
}

export interface CompanyUIProps {
    id: string;
    name: string;
    email: string;
    website: string;
    phone_number: string;
    email_verified: boolean;
    admin_verified: boolean;
} 