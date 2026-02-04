import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2 } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Notifications = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			position="top-right"
			expand={false}
			richColors={false}
			closeButton
			duration={4000}
			gap={12}
			icons={{
				success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
				error: <XCircle className="h-5 w-5 text-red-500" />,
				warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
				info: <Info className="h-5 w-5 text-blue-500" />,
				loading: <Loader2 className="h-5 w-5 text-primary animate-spin" />,
			}}
			toastOptions={{
				unstyled: true,
				classNames: {
					toast: `
            group w-full max-w-[380px] p-4 
            flex items-start gap-3
            bg-card/98 backdrop-blur-xl
            border border-border/60
            rounded-2xl
            shadow-[0_8px_30px_rgb(0,0,0,0.12)]
            dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]
            animate-in slide-in-from-right-full fade-in-0 duration-300
            data-[swipe=cancel]:translate-x-0 
            data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]
          `,
					title: "text-sm font-semibold text-foreground leading-tight",
					description: "text-sm text-muted-foreground mt-1 leading-relaxed",
					actionButton: `
            px-3 py-1.5 text-xs font-medium rounded-lg
            bg-primary text-primary-foreground
            hover:bg-primary/90 transition-colors
          `,
					cancelButton: `
            px-3 py-1.5 text-xs font-medium rounded-lg
            bg-muted text-muted-foreground
            hover:bg-muted/80 transition-colors
          `,
					closeButton: `
            absolute top-3 right-3
            p-1 rounded-lg
            text-muted-foreground/60
            hover:text-foreground hover:bg-muted/50
            transition-all opacity-0 group-hover:opacity-100
          `,
					success: "border-l-4 border-l-emerald-500/80",
					error: "border-l-4 border-l-red-500/80",
					warning: "border-l-4 border-l-amber-500/80",
					info: "border-l-4 border-l-blue-500/80",
					loading: "border-l-4 border-l-primary/80",
				},
			}}
			{...props}
		/>
	);
};

export { Notifications };
