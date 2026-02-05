import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';

import { useSidebarStore } from '@/stores/sidebarStore';
import { cn } from '@/utils';

interface MainLayoutProps {
	children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
	const { isAuthenticated, isLoading } = useAuth();
	const { isCollapsed } = useSidebarStore();

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return (
		<div className="min-h-screen bg-background">
			<Sidebar />
			<main className={cn(
				"min-h-screen p-4 md:p-6 transition-all duration-300",
				isCollapsed ? "ml-0 md:ml-20" : "ml-0 md:ml-80"
			)}>
				<div className="md:hidden mb-4">
					<MobileSidebar />
				</div>
				<div className="animate-fade-in">{children}</div>
			</main>
		</div>
	);
}
