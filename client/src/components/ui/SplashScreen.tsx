import { useEffect, useState } from "react";
import { Shield, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SplashScreenProps {
    onFinish?: () => void;
    minDuration?: number;
}

export function SplashScreen({ onFinish, minDuration = 2000 }: SplashScreenProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Start pulse animation sequence
        const animTimer = setTimeout(() => setIsAnimating(true), 100);

        // Minimum display time
        const finishTimer = setTimeout(() => {
            setIsVisible(false);
            // Wait for exit animation to finish
            setTimeout(() => {
                if (onFinish) onFinish();
            }, 1000);
        }, minDuration);

        return () => {
            clearTimeout(animTimer);
            clearTimeout(finishTimer);
        };
    }, [onFinish, minDuration]);

    if (!isVisible && !isAnimating) return null;

    return (
        <div
            className={cn(
                "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-all duration-1000 ease-in-out",
                !isVisible ? "opacity-0 scale-110 pointer-events-none" : "opacity-100 scale-100"
            )}
        >
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute top-[20%] left-[20%] w-1 h-1 bg-primary/40 rounded-full blur-sm animate-ping" />
                <div className="absolute bottom-[20%] right-[30%] w-1.5 h-1.5 bg-blue-400/30 rounded-full blur-sm animate-bounce" />
            </div>

            <div className="relative flex flex-col items-center">
                {/* Logo Container */}
                <div className={cn(
                    "relative transition-all duration-1000 ease-out transform",
                    isAnimating ? "translate-y-0 opacity-100 scale-100" : "translate-y-12 opacity-0 scale-90"
                )}>
                    <div className="relative p-8 mb-8">
                        {/* Outer rotating ring */}
                        <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-[spin_10s_linear_infinite]" />
                        <div className="absolute inset-2 border border-dashed border-primary/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

                        {/* Main Logo Icon */}
                        <div className="relative z-10 flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary via-primary/80 to-blue-700 rounded-3xl shadow-glow transform transition-transform duration-500 hover:rotate-6">
                            <Shield className="w-12 h-12 text-primary-foreground drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
                        </div>
                    </div>

                    {/* Branding Text */}
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl md:text-5xl font-black tracking-[0.2em] text-foreground">
                            Athena
                        </h1>
                        <div className="flex items-center justify-center gap-3">
                            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-primary/50" />
                            <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-primary/80">
                                Sistema Pxtalk de Controle Interno
                            </span>
                            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-primary/50" />
                        </div>
                    </div>
                </div>

                {/* Progress Indicator */}
                <div className={cn(
                    "mt-16 w-48 h-[2px] bg-primary/10 rounded-full overflow-hidden transition-all duration-1000 delay-500",
                    isAnimating ? "opacity-100" : "opacity-0"
                )}>
                    <div className="h-full bg-gradient-to-r from-transparent via-primary to-transparent w-2/3 animate-[loading_2s_ease-in-out_infinite]" />
                </div>
            </div>

            <p className="absolute bottom-12 text-[9px] uppercase font-bold tracking-[0.3em] text-muted-foreground/40 select-none">
                Iniciando configurações do sistema...
            </p>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
            `}} />
        </div>
    );
}
