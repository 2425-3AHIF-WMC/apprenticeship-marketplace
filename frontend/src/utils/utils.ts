import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"
import { CompanyUIPropsAdmin } from "./interfaces";
import { InternshipUIProps } from "./interfaces";
import { InternshipDetailsUIProps } from "./interfaces";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// --- Mapping Helpers ---
export function mapBackendToCompanyUIPropsAdmin(item: any): CompanyUIPropsAdmin {
    return {
        company_id: item.company_id,
        name: item.name,
        company_info: item.company_info ?? '',
        website: item.website ?? '',
        email: item.email ?? '',
        phone_number: item.phone_number ?? '',
        password: item.password ?? '',
        email_verified: item.email_verified === true || item.email_verified === 'true' || item.email_verified === 1,
        admin_verified: item.admin_verified === true || item.admin_verified === 'true' || item.admin_verified === 1,
        company_registration_timestamp: item.company_registration_timestamp ? new Date(item.company_registration_timestamp).toISOString() : '',
        email_verification_timestamp: item.email_verification_timestamp ? new Date(item.email_verification_timestamp).toISOString() : '',
        admin_verification_timestamp: item.admin_verification_timestamp ? new Date(item.admin_verification_timestamp).toISOString() : '',
        company_logo: item.company_logo_path ?? '',
        company_number: item.company_number ?? '',
        internships: Array.isArray(item.internships) ? item.internships : [],
    };
}

export function mapBackendToInternshipProps(item: any): InternshipUIProps {
    return {
        id: item.internship_id || item.id,
        title: item.title,
        company_name: item.company_name,
        location: item.location.split(',')[0],
        duration: item.duration,
        application_end: item.application_end ? new Date(item.application_end).toISOString().slice(0, 10) : '',
        added: item.added || '',
        views: item.views || 0,
        work_type: item.work_type,
        company_logo: item.company_logo_path,
        department: Array.isArray(item.department) ? item.department : Array.isArray(item.category) ? item.category : [item.department || item.category],
        min_year: item.min_year ? `${item.min_year}. Schulstufe` : '',
        company_link: item.companyLink || item.company_link || '',
        internship_link: item.internship_link || '',
        admin_verified: item.admin_verified === true || item.admin_verified === 'true' || item.admin_verified === 1,
    };
}

export function mapBackendToInternshipDetailsProps(item: any): InternshipDetailsUIProps {
    return {
        id: item.internship_id || item.id,
        title: item.title,
        company_name: item.company_name,
        location: item.location || item.site,
        duration: item.duration,
        application_end: item.application_end ? new Date(item.application_end).toISOString().slice(0, 10) : '',
        salary: `${item.salary} ${isNaN(Number(item.salary)) ? '' : '€'}`,
        added: item.added,
        views: item.views,
        work_type: item.work_type,
        company_logo: item.company_logo_path,
        category: Array.isArray(item.category) ? item.category : [item.category],
        min_year: item.min_year ? `${item.min_year}. Schulstufe` : '',
        company_link: item.company_link,
        internship_link: item.internship_link,
        company_id: item.company_id,
        company_info: item.company_info || '',
        pdf: item.pdf || '',
        location_id: item.location_id || '',
    };
}

// --- Status Helpers ---
export function getCompanyStatus(company: { admin_verified: boolean; email_verified: boolean }): 'vollständig' | 'nur_email' | 'keine' {
    if (company.admin_verified && company.email_verified) return 'vollständig';
    if (company.email_verified) return 'nur_email';
    return 'keine';
}

export interface InternshipFilterOptions {
    searchTerm: string;
    selectedCategory: string;
    selectedWorkMode: string;
    selectedDuration: string;
    selectedSchoolYear: string;
}

export function filterInternships(
    internships: InternshipUIProps[],
    options: InternshipFilterOptions
): InternshipUIProps[] {
    const {
        searchTerm,
        selectedCategory,
        selectedWorkMode,
        selectedDuration,
        selectedSchoolYear
    } = options;

    return internships.filter((internship) => {
        const matchesSearch =
            searchTerm === '' ||
            internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            internship.company_name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === 'Alle' ||
            (Array.isArray(internship.department) && internship.department.includes(selectedCategory));

        const matchesWorkMode =
            selectedWorkMode === 'Alle' || internship.work_type === selectedWorkMode;

        const matchesDuration =
            selectedDuration === 'Alle' || internship.duration === selectedDuration;

        const matchesSchoolYear =
            selectedSchoolYear === 'Alle Schulstufen' || internship.min_year === selectedSchoolYear;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesWorkMode &&
            matchesDuration &&
            matchesSchoolYear
        );
    });
}