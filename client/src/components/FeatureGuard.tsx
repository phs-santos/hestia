import { Navigate } from 'react-router-dom';
import { useFeature } from '@/hooks/useFeature'; // or create this hook if not exists
import { ReactNode } from 'react';

interface FeatureGuardProps {
    featureId: string;
    children: ReactNode;
    redirectTo?: string;
}

export function FeatureGuard({ featureId, children, redirectTo = '/unauthorized' }: FeatureGuardProps) {
    const { canAccess, isLoading } = useFeature();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <span className="text-[10px] font-black tracking-widest text-primary uppercase animate-pulse">Verificando Protocolos...</span>
                </div>
            </div>
        );
    }

    if (!canAccess(featureId)) {
        console.warn(`Access denied for feature: ${featureId}`);
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
}
