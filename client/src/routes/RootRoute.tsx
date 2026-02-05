import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface Props {
	children: ReactNode;
}

export function RootRoute({ children }: Props) {
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

	if (user.role !== 'ROOT') {
		return <Navigate to="/unauthorized" replace />;
	}

	return <>{children}</>;
}
