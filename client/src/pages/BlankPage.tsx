import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BlankPageProps {
    title?: string;
    description?: string;
    children?: ReactNode;
}

export default function BlankPage({
    title = 'Página em Branco',
    description = 'Inicie sua nova funcionalidade aqui.',
    children
}: BlankPageProps) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground animate-fade-in">
            {/* Header Component */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4 md:px-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(-1)}
                            className="rounded-full"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">{title}</h1>
                            <p className="text-xs text-muted-foreground hidden md:block">{description}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Button size="sm">Ação Principal</Button>
                    </div>
                </div>
            </header>

            {/* Main Container */}
            <main className="flex-1 flex flex-col py-8">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl w-full">
                    {children || (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 border-2 border-dashed border-muted rounded-3xl p-12">
                            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <span className="text-2xl font-black text-primary">H</span>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tight">Comece algo incrível</h2>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    Este é o seu novo canvas. Use os componentes do Hestia para construir interfaces poderosas e rápidas.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <Button variant="outline">Documentação</Button>
                                <Button>Criar Componente</Button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer Component */}
            <footer className="border-t py-8 bg-muted/30">
                <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-sm font-black text-primary-foreground">H</span>
                        </div>
                        <p className="text-sm font-bold tracking-tight">HESTIA <span className="text-muted-foreground font-normal">v1.0.0</span></p>
                    </div>

                    <nav className="flex items-center gap-6 text-sm text-muted-foreground font-medium">
                        <a href="#" className="hover:text-primary transition-colors">Suporte</a>
                        <a href="#" className="hover:text-primary transition-colors">Termos</a>
                        <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
                    </nav>

                    <p className="text-xs text-muted-foreground/60">
                        © 2026 Inside Solutions. Todos os direitos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
}
