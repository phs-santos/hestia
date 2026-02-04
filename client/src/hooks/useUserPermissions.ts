import { useAuth } from "@/contexts/AuthContext";

export enum UserRole {
    ADMIN = 'admin',
    TECHNICIAN = 'technician',
    OWNER_DEVELOPER = 'owner_developer',
    USER = 'user',
    DEVELOPER = 'developer',
    SDR = 'sdr',
    CLOSER = 'closer',
    MARKETING = 'marketing'
}

export function useUserPermissions() {
    const { user } = useAuth();
    const role = user?.role as UserRole;
    const isAdmin = role === UserRole.ADMIN;
    const isTechnician = role === UserRole.TECHNICIAN;
    const isOwnerDeveloper = role === UserRole.OWNER_DEVELOPER;
    const isUser = role === UserRole.USER;
    const isDeveloper = role === UserRole.DEVELOPER;
    const isSDR = role === UserRole.SDR;
    const isCloser = role === UserRole.CLOSER;
    const isMarketing = role === UserRole.MARKETING;

    const isHighLevelAdmin = isAdmin || isDeveloper || isOwnerDeveloper;
    const isSupport = isTechnician || isHighLevelAdmin;
    const isCommercial = isSDR || isCloser || isMarketing;

    let defaultRoute = '/overview';

    if (isSupport) {
        defaultRoute = '/dashboard';
    }

    return {
        role,
        isAdmin: isHighLevelAdmin, // Exposing the broader admin definition as 'isAdmin' for simplicity in components
        isTechnician,
        isOwnerDeveloper,
        isSupport,
        isUser,
        isDeveloper,
        isSDR,
        isCloser,
        isMarketing,
        isCommercial,
        defaultRoute,

        // Helper to check specific strict role if needed
        isStrictAdmin: isAdmin,
    };
}
