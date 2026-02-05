import { useAuth } from '@/context/AuthContext';
import { isFeatureEnabled } from '@/config/features';

export function useFeature() {
    const { user } = useAuth();
    const userRole = user?.role as any; // Cast generic string to UserRole if needed

    const canAccess = (featureId: string) => {
        return isFeatureEnabled(featureId, userRole);
    };

    return { canAccess };
}
