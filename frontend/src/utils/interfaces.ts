// Frontend interfaces matching backend/src/model.ts

export interface Student {
    studentId: string;
    username: string;
    added: string; // ISO date string
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
    start_date: string;
    salary: string;
    internship_link: string;
    company_id: string;
    pdf: string;
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