import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AdminRouteProps {
	children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
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

	if (user.role !== 'ADMIN') {
		return <Navigate to="/unauthorized" replace />;
	}

	return <>{children}</>;
}
