import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { monitoringService } from '@/features/monitoring/api/monitoringService';
import { FeatureConfig, UserRole } from '@/config/features';

interface FeatureContextType {
    features: FeatureConfig[];
    isLoading: boolean;
    canAccess: (featureId: string) => boolean;
    refreshFeatures: () => Promise<void>;
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export function FeatureProvider({ children }: { children: ReactNode }) {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const [features, setFeatures] = useState<FeatureConfig[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadFeatures = async (initialFeatures?: any[]) => {
        if (authLoading) return;

        if (!isAuthenticated) {
            setFeatures([]);
            setIsLoading(false);
            return;
        }

        if (initialFeatures) {
            mapAndSetFeatures(initialFeatures);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const data = await monitoringService.getFeatures();
            mapAndSetFeatures(data);
        } catch (error) {
            console.error('Failed to load features:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const mapAndSetFeatures = (data: any[]) => {
        const mappedFeatures: FeatureConfig[] = data.map((f: any) => ({
            id: f.code,
            name: f.name,
            enabled: f.enabled,
            path: f.path,
            description: f.description,
            allowedRoles: f.allowedRoles as UserRole[],
            subfeatures: (f.subfeatures || []).map((sf: any) => ({
                id: sf.code,
                name: sf.name,
                enabled: sf.enabled,
                path: sf.path,
                allowedRoles: sf.allowedRoles as UserRole[]
            }))
        }));
        setFeatures(mappedFeatures);
    };

    useEffect(() => {
        if (authLoading) return;

        if (user?.features) {
            loadFeatures(user.features);
        } else {
            loadFeatures();
        }
    }, [isAuthenticated, user?.features, authLoading]);

    const canAccess = (featureId: string) => {
        const findInFeatures = (list: FeatureConfig[], id: string): FeatureConfig | undefined => {
            for (const f of list) {
                if (f.id === id) return f;
                if (f.subfeatures) {
                    const found = findInFeatures(f.subfeatures, id);
                    if (found) return found;
                }
            }
            return undefined;
        };

        const feature = findInFeatures(features, featureId);
        if (!feature || !feature.enabled) return false;

        if (user?.role && feature.allowedRoles) {
            return feature.allowedRoles.includes(user.role as UserRole);
        }

        return true;
    };

    return (
        <FeatureContext.Provider value={{
            features,
            isLoading: isLoading || authLoading,
            canAccess,
            refreshFeatures: loadFeatures
        }}>
            {children}
        </FeatureContext.Provider>
    );
}

export function useFeatures() {
    const context = useContext(FeatureContext);
    if (context === undefined) {
        throw new Error('useFeatures must be used within a FeatureProvider');
    }
    return context;
}
