import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface UserRouteProps {
    children: ReactNode;
}

export function UserRoute({ children }: UserRouteProps) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-muted-foreground">Carregando...</div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Allows admin, technician, and user
    if (!['admin', 'technician', 'user', 'sdr', 'closer', 'marketing', 'developer', 'owner_developer'].includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
}
