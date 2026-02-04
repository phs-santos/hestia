import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, AuthUser } from '@/services/authService';
import { useInvalidateCache } from '@/hooks/use-data-loader';

interface AuthContextType {
	user: AuthUser | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	isAdmin: boolean;
	login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
	register: (name: string, nickname: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const { invalidateAll } = useInvalidateCache();
	const navigate = useNavigate();

	useEffect(() => {
		const initAuth = () => {
			const session = authService.getSession();
			if (session?.isValid) {
				setUser(session.user);
			} else {
				authService.clearSession();
				setUser(null);
			}
			setIsLoading(false);
		};

		initAuth();
	}, []);

	const login = async (identifier: string, password: string): Promise<{ success: boolean; error?: string }> => {
		try {
			const userWithRole = await authService.signIn({ identifier, password });
			setUser(userWithRole);
			return { success: true };
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Erro ao fazer login';
			return { success: false, error: message };
		}
	};

	const register = async (name: string, nickname: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
		try {
			await authService.signUp({ name, nickname, email, password });
			// Removido setUser para não logar automaticamente após o cadastro
			return { success: true };
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Erro ao criar conta';
			return { success: false, error: message };
		}
	};

	const logout = async () => {
		await authService.signOut();
		setUser(null);
		invalidateAll();
		navigate('/login');
	};

	const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROOT';

	return (
		<AuthContext.Provider value={{
			user,
			isAuthenticated: !!user,
			isLoading,
			isAdmin,
			login,
			register,
			logout
		}}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
