import { Routes, Route } from "react-router-dom";
import './App.css'

import { useEffect } from "react";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound"
import Internships from "@/pages/Internships";
import InternshipDescription from "./pages/InternshipDetails";
import Login from "@/pages/Login";
import ProtectedRoute from "@/components/ProtectedRoute";
import StudentDashboard from "@/pages/StudentDashboard";
import AccessDenied from "@/pages/AccessDenied";
import StudentFavourites from "@/pages/StudentFavourites";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminInternships from "@/pages/AdminInternships";
import AdminCompanies from "@/pages/AdminCompanies";
import CompanyDashboard from "@/pages/CompanyDashboard.tsx";
import AdminToVerify from "@/pages/AdminToVerify";
import CompanyInternshipCreation from "@/pages/CompanyInternshipCreation.tsx";
import CompanyDetails from "@/pages/CompanyDetails";
import VerifyEmail from "@/pages/VerifyEmail.tsx";
import CompanySettings from "@/pages/CompanySettings.tsx";
import ResetPassword from "@/pages/ResetPassword.tsx";
import CompanyInternships from "@/pages/CompanyInternships.tsx";

function App() {
    // Smooth scroll behavior for the entire app
    useEffect(() => {
        const handleLinkClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');

            if (link && link.href.includes('#') && !link.href.startsWith('#') && link.origin === window.location.origin) {
                const hash = link.href.split('#')[1];
                const element = document.getElementById(hash);

                if (element) {
                    e.preventDefault();
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        };

        document.addEventListener('click', handleLinkClick);
        return () => document.removeEventListener('click', handleLinkClick);
    }, []);

    return (
        <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/internships" element={
                <ProtectedRoute allow={['student', 'admin']}>
                    <Internships />
                </ProtectedRoute>
            } />
            <Route path="/internships/:id" element={
                <ProtectedRoute allow={['student', 'admin', 'company']}>
                    <InternshipDescription />
                </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route
                path="/student/dashboard"
                element={
                    <ProtectedRoute allow={['student']}>
                        <StudentDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student/favourites"
                element={
                    <ProtectedRoute allow={['student']}>
                        <StudentFavourites />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute allow={['admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/internships"
                element={
                    <ProtectedRoute allow={['admin']}>
                        <AdminInternships />
                    </ProtectedRoute>
                }
                />
            <Route
                path="/admin/companies"
                element={
                    <ProtectedRoute allow={['admin']}>
                        <AdminCompanies />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/companies/verify"
                element={
                    <ProtectedRoute allow={['admin']}>
                        <AdminToVerify />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/companies/:id"
                element={
                    <ProtectedRoute allow={['student', 'admin', 'company']}>
                        <CompanyDetails />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/company/dashboard"
                element={
                    <ProtectedRoute allow={['company']}>
                        <CompanyDashboard/>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/company/internship/create"
                element={
                <ProtectedRoute allow={['company']}>
                    <CompanyInternshipCreation/>
                </ProtectedRoute>
                }
            />
            <Route
                path="/company/settings"
                element={
                    <ProtectedRoute allow={['company']}>
                        <CompanySettings/>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/company/internships"
                element={
                    <ProtectedRoute allow={['company']}>
                        <CompanyInternships/>
                    </ProtectedRoute>
                }
            />

            <Route path="/access-denied" element={<AccessDenied />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/verify-email/:token" element={<VerifyEmail/>} />
            <Route path="/reset-password/:token" element={<ResetPassword/>} />

        </Routes>
    )
}

export default App