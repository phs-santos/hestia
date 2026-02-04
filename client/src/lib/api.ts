import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
const api: AxiosInstance = axios.create({
    baseURL: "/api",
    timeout: 30000, // 30 seconds
    headers: { "Content-Type": "application/json" },
});

const apiAuth = axios.create({
    baseURL: "/api",
    timeout: 30000, // 30 seconds
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptador de requisição - Adiciona o token de autenticação nas requisições
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiAuth.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const sessionToken = localStorage.getItem("auth_session_token") || sessionStorage.getItem("auth_session_token");
        if (sessionToken) {
            config.headers.Authorization = `Bearer ${sessionToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptador de resposta - Manipula erros globalmente
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        // Handle different error scenarios
        if (error.response) {
            // Server responded with error status
            switch (error.response.status) {
                case 401:
                    // Unauthorized - redirect to login
                    console.error("Acesso não autorizado.");
                    localStorage.removeItem("user");
                    localStorage.removeItem("auth_token");
                    sessionStorage.removeItem("auth_token");
                    break;
                case 403:
                    // Forbidden
                    console.error("Acesso proibido.");
                    break;
                case 404:
                    // Not found
                    console.error("Recurso não encontrado.");
                    break;
                case 500:
                    // Server error
                    console.error("Erro interno do servidor.");
                    break;
                default:
                    console.error("API Error:", error.response.status);
            }
        } else if (error.request) {
            // Request made but no response received
            console.error("No response from server");
        } else {
            // Error in request setup
            console.error("Request error:", error.message);
        }

        return Promise.reject(error);
    }
);

apiAuth.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        // Handle different error scenarios
        if (error.response) {
            // Server responded with error status
            switch (error.response.status) {
                case 401:
                    // Unauthorized - redirect to login
                    console.error("Acesso não autorizado.");
                    localStorage.removeItem("user");
                    localStorage.removeItem("auth_session_token");
                    sessionStorage.removeItem("auth_session_token");
                    break;
                case 403:
                    // Forbidden
                    console.error("Acesso proibido.");
                    break;
                case 404:
                    // Not found
                    console.error("Recurso não encontrado.");
                    break;
                case 500:
                    // Server error
                    console.error("Erro interno do servidor.");
                    break;
                default:
                    console.error("API Error:", error.response.status);
            }
        } else if (error.request) {
            // Request made but no response received
            console.error("No response from server");
        } else {
            // Error in request setup
            console.error("Request error:", error.message);
        }

        return Promise.reject(error);
    }
);

export {
    api,
    apiAuth
}

// Helper function to handle API errors
export const handleApiError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
            return error.response.data.message;
        }
        if (error.response?.statusText) {
            return error.response.statusText;
        }
        if (error.message) {
            return error.message;
        }
    }
    return "Ocorreu um erro inesperado";
};
