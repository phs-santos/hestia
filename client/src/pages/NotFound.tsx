import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Ghost, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		console.error("404 Error: User attempted to access non-existent route:", location.pathname);
	}, [location.pathname]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
			<div className="w-full max-w-md text-center space-y-8 animate-slide-up">

				{/* Icon Container */}
				<div className="flex justify-center">
					<div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-glow animate-pulse-slow">
						<Ghost className="h-16 w-16 text-primary" />
					</div>
				</div>

				{/* Text Content */}
				<div className="space-y-4">
					<h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
						404
					</h1>
					<h2 className="text-2xl font-semibold text-foreground">
						Página não encontrada
					</h2>
					<p className="text-muted-foreground text-lg max-w-sm mx-auto">
						Ops! Parece que você se perdeu no caminho. A página que você está procurando não existe ou foi movida.
					</p>
				</div>

				{/* Actions */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
					<Button
						variant="outline"
						size="lg"
						onClick={() => navigate(-1)}
						className="gap-2"
					>
						<ArrowLeft className="h-4 w-4" />
						Voltar
					</Button>

					<Button
						size="lg"
						onClick={() => navigate('/')}
						className="gap-2 shadow-lg shadow-primary/20"
					>
						<Home className="h-4 w-4" />
						Ir para o Início
					</Button>
				</div>
			</div>
		</div>
	);
};
