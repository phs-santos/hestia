import { Notifications } from "@/components/ui/notifications";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

import { SplashScreen } from "@/components/ui/SplashScreen";
import { useState } from "react";
import AppRoutes from "./AppRoutes";

const queryClient = new QueryClient();

export default function App() {
	const [showSplash, setShowSplash] = useState(true);

	return (
		<ThemeProvider>
			{showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
			<BrowserRouter
				future={{
					v7_startTransition: true,
					v7_relativeSplatPath: true,
				}}
			>
				<QueryClientProvider client={queryClient}>
					<AuthProvider>
						<TooltipProvider>
							<Notifications />
							<AppRoutes />
						</TooltipProvider>
					</AuthProvider>
				</QueryClientProvider>
			</BrowserRouter>
		</ThemeProvider>
	)
};
