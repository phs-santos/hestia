import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft, Home, Lock } from "lucide-react";

export default function Unauthorized() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <div className="w-full max-w-md text-center space-y-8 animate-slide-up">

                {/* Icon Container */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-destructive/20 to-destructive/5 flex items-center justify-center shadow-glow border border-destructive/20">
                            <ShieldAlert className="h-16 w-16 text-destructive" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-background rounded-full border border-border flex items-center justify-center shadow-lg">
                            <Lock className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-foreground">
                        Acesso Negado
                    </h1>
                    <h2 className="text-xl font-medium text-muted-foreground italic">
                        403 - Forbidden
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-sm mx-auto">
                        Você não tem as permissões necessárias para acessar esta funcionalidade.
                        Por favor, entre em contato com o administrador se você acredita que isso é um erro.
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
