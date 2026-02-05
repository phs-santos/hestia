import { Navigate } from 'react-router-dom';
import { useFeature } from '@/hooks/useFeature'; // or create this hook if not exists
import { ReactNode } from 'react';

interface FeatureGuardProps {
    featureId: string;
    children: ReactNode;
    redirectTo?: string;
}

export function FeatureGuard({ featureId, children, redirectTo = '/dashboard' }: FeatureGuardProps) {
    const { canAccess } = useFeature();

    if (!canAccess(featureId)) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
}
