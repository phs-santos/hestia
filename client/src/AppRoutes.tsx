import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { RootRoute } from "@/components/auth/RootRoute";

const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Servers = lazy(() => import("@/pages/Servers"));
const Services = lazy(() => import("@/pages/Services"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function AppRoutes() {
    function LoadingSpinner() {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    function RedirectHandler() {
        const { isAuthenticated } = useAuth();

        if (!isAuthenticated) {
            return <Navigate to="/login" replace />;
        }

        return <Navigate to="/dashboard" replace />;
    }

    return (
        <>
            <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                    <Route path="/" element={<RedirectHandler />} />
                    <Route path="/login" element={<Login />} />

                    <Route path="/dashboard" element={
                        <RootRoute>
                            <Dashboard />
                        </RootRoute>
                    } />

                    <Route path="/servers" element={
                        <RootRoute>
                            <Servers />
                        </RootRoute>
                    } />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </>
    )
}
