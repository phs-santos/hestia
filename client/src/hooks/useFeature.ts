import { useFeatures } from '@/context/FeatureContext';

export function useFeature() {
    const { canAccess: contextCanAccess, isLoading } = useFeatures();

    const canAccess = (featureId: string) => {
        return contextCanAccess(featureId);
    };

    return { canAccess, isLoading };
}
