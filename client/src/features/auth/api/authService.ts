import { api, apiAuth } from "@/services/api";

export interface AuthUser {
    id: string;
    name: string;
    nickname: string;
    email: string;
    role: "ROOT" | "ADMIN" | "USER";
    lastLogin: string;
    createdAt: string;
    updatedAt: string;
    features?: any[];
}

export interface JwtPayload {
    id: string;
    email: string;
    nickname: string;
    role: "ROOT" | "ADMIN" | "USER";
    iat: number;
    exp: number;
}

export interface AuthResponse {
    data: any;
    error: boolean;
    message?: string;
}

export interface ApiError {
    message?: string;
    code?: string;
    status?: number;
}

export interface SignUpRequest {
    name: string;
    nickname: string;
    email: string;
    password: string;
}

export interface SignInRequest {
    identifier: string;
    password: string;
}

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

/**
 * Decode JWT payload without verification (server handles verification)
 */
const decodeJwt = (token: string): JwtPayload | null => {
    try {
        const base64Payload = token.split(".")[1];
        const payload = atob(base64Payload);
        return JSON.parse(payload);
    } catch {
        return null;
    }
};

/**
 * Parse API error response for user-friendly messages
 */
const getErrorMessage = (error: unknown): string => {
    if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
            response?: {
                data?: { message?: string; code?: string; error?: string; };
                status?: number;
            };
        };
        const data = axiosError.response?.data;
        const status = axiosError.response?.status;

        if (data.error === "User not approved") {
            return "Usuário ainda não aprovado.";
        }
        if (
            data?.code === "USER_ALREADY_EXISTS" ||
            data?.message?.includes("already exists")
        ) {
            return "Este e-mail já está cadastrado. Tente fazer login.";
        }
        if (data?.code === "INVALID_CREDENTIALS" || status === 401) {
            return "E-mail ou senha incorretos.";
        }
        if (data?.code === "USER_NOT_FOUND") {
            return "Usuário não encontrado.";
        }
        if (data?.code === "INVALID_EMAIL") {
            return "E-mail inválido.";
        }
        if (data?.code === "WEAK_PASSWORD") {
            return "A senha deve ter pelo menos 8 caracteres.";
        }
        if (status === 429) {
            return "Muitas tentativas. Aguarde alguns minutos.";
        }
        if (status === 500) {
            return "Erro no servidor. Tente novamente mais tarde.";
        }

        // Return server message if available
        if (data?.message) {
            return data.message;
        }
    }

    return "Ocorreu um erro. Tente novamente.";
};

export const authService = {
    /**
     * Registrar usuário
     */
    signUp: async (data: SignUpRequest): Promise<AuthResponse> => {
        try {
            const { data: response } = await api.post<AuthResponse>("/auth/register", data);
            return response;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    /**
     * Sign in with email and password
     */
    signIn: async (data: SignInRequest): Promise<AuthUser> => {
        try {
            const isEmail = data.identifier.includes("@");
            const endpoint = isEmail ? "/auth/login/email" : "/auth/login/nickname";
            const payload = isEmail ? { email: data.identifier, password: data.password } : { nickname: data.identifier, password: data.password };

            const { data: response } = await api.post<AuthResponse>(endpoint, payload);

            if (response.error) {
                throw new Error(response.message || "Erro ao fazer login");
            }

            const { token, user, features } = response.data;

            // Attach features to user for storage
            const userWithFeatures = { ...user, features };

            // Persistir sessão
            authService.saveSession(token, userWithFeatures);

            return userWithFeatures;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    /**
     * Change password (Not implemented in current backend)
     */
    changePassword: async (data: any): Promise<void> => {
        try {
            await apiAuth.post("/auth/change-password", data);
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    /**
     * Get current session from stored token
     */
    getSession: (): { user: AuthUser; isValid: boolean } | null => {
        const token = authService.getToken();
        const storedUser = authService.getStoredUser();

        if (!token || !storedUser) {
            return null;
        }

        const jwtPayload = decodeJwt(token);
        if (!jwtPayload) {
            authService.clearSession();
            return null;
        }

        // Check if token is expired
        const now = Math.floor(Date.now() / 1000);
        if (jwtPayload.exp < now) {
            authService.clearSession();
            return null;
        }

        return { user: storedUser, isValid: true };
    },

    /**
     * Sign out
     */
    signOut: async (): Promise<void> => {
        try {
            await apiAuth.post("/auth/sign-out");
        } finally {
            authService.clearSession();
        }
    },

    /**
     * Save session to localStorage
     */
    saveSession: (token: string, user: AuthUser): void => {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    },

    /**
     * Clear session from localStorage
     */
    clearSession: (): void => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
        sessionStorage.removeItem(AUTH_USER_KEY);
    },


    /**
     * Get stored token
     */
    getToken: (): string | null => {
        return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
    },

    /**
     * Get stored user
     */
    getStoredUser: (): AuthUser | null => {
        const stored = localStorage.getItem(AUTH_USER_KEY) || sessionStorage.getItem(AUTH_USER_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                return null;
            }
        }
        return null;
    },

    /**
     * Get decoded JWT payload
     */
    getJwtPayload: (): JwtPayload | null => {
        const token = authService.getToken();
        if (!token) return null;
        return decodeJwt(token);
    },
};
