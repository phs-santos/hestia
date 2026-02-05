import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { RootRoute } from "@/routes/RootRoute";
import { FeatureGuard } from "@/components/FeatureGuard";

import { useSeleneWidget } from "@/hooks/use-selene-widget";

const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Servers = lazy(() => import("@/features/monitoring/pages/Servers"));
const ServerDetail = lazy(() => import("@/features/monitoring/pages/ServerDetail"));
const Services = lazy(() => import("@/features/monitoring/pages/Services"));
const ServiceDetail = lazy(() => import("@/features/monitoring/pages/ServiceDetail"));

const BlankPage = lazy(() => import("@/pages/BlankPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function AppRoutes() {
    const { isAuthenticated } = useAuth();

    useSeleneWidget(!!isAuthenticated, {
        apiKey: "sk_I8MnrjIifpDJoJVoe8j6xu2w",
        widget: "support",
    });

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
                            <FeatureGuard featureId="dashboard">
                                <Dashboard />
                            </FeatureGuard>
                        </RootRoute>
                    } />

                    <Route path="/servers" element={
                        <RootRoute>
                            <FeatureGuard featureId="monitoring-servers">
                                <Servers />
                            </FeatureGuard>
                        </RootRoute>
                    } />

                    <Route path="/servers/:id" element={
                        <RootRoute>
                            <ServerDetail />
                        </RootRoute>
                    } />

                    <Route path="/services" element={
                        <RootRoute>
                            <FeatureGuard featureId="monitoring-services">
                                <Services />
                            </FeatureGuard>
                        </RootRoute>
                    } />

                    <Route path="/servers/:serverId/services/:serviceId" element={
                        <RootRoute>
                            <ServiceDetail />
                        </RootRoute>
                    } />

                    <Route path="/blank" element={<BlankPage />} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </>
    )
}
