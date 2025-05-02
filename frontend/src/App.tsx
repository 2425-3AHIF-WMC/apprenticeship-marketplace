import { Routes, Route } from "react-router-dom";
import './App.css'

import { useEffect } from "react";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound"
import Internships from "@/pages/Internships";
import Login from "@/pages/Login";
import ProtectedRoute from "@/components/ProtectedRoute";
import StudentDashboard from "@/pages/StudentDashboard";
import AccessDenied from "@/pages/AccessDenied";
import StudentFavourites from "@/pages/StudentFavourites";

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
            <Route path="/access-denied" element={<AccessDenied />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default App