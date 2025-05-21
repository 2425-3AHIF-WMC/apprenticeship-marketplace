import { Routes, Route } from "react-router-dom";
import './App.css'

import { useEffect } from "react";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound"
import Internships from "@/pages/Internships";
import InternshipDescription from "./pages/InternshipDescription";
import Login from "@/pages/Login";
import ProtectedRoute from "@/components/ProtectedRoute";
import StudentDashboard from "@/pages/StudentDashboard";
import AccessDenied from "@/pages/AccessDenied";
import StudentFavourites from "@/pages/StudentFavourites";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminInternships from "@/pages/AdminInternships";
import AdminCompanies from "@/pages/AdminCompanies";
import ProtectedCompanyRoute from "@/components/ProtectedCompanyRoute.tsx";
import CompanyDashboard from "@/pages/CompanyDashboard.tsx";
import AdminToVerify from "@/pages/AdminToVerify";

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
                <ProtectedRoute>
                    <Internships />
                </ProtectedRoute>
            } />
            <Route path="/internships/1" element={
                <ProtectedRoute>
                    <InternshipDescription />
                </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route
                path="/student/dashboard"
                element={
                    <ProtectedRoute>
                        <StudentDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student/favourites"
                element={
                    <ProtectedRoute>
                        <StudentFavourites />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/internships"
                element={
                    <ProtectedRoute>
                        <AdminInternships />
                    </ProtectedRoute>
                }
                />
            <Route
                path="/admin/companies"
                element={
                    <ProtectedRoute>
                        <AdminCompanies />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/companies/verify"
                element={
                    <ProtectedRoute>
                        <AdminToVerify />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/company/dashboard"
                element={
                    <ProtectedCompanyRoute>
                        <CompanyDashboard/>
                    </ProtectedCompanyRoute>
                }
            />
            <Route path="/access-denied" element={<AccessDenied />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default App