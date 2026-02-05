import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils';

interface ThemeToggleProps {
	className?: string;
	variant?: 'default' | 'sidebar';
}

export function ThemeToggle({ className, variant = 'default' }: ThemeToggleProps) {
	const { theme, setTheme } = useTheme();

	const toggleTheme = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark');
	};

	if (variant === 'sidebar') {
		return (
			<Button
				variant="ghost"
				size="sm"
				onClick={toggleTheme}
				className={cn(
					'w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors',
					className
				)}
			>
				{theme === 'dark' ? (
					<>
						<Sun className="h-4 w-4" />
						Modo Claro
					</>
				) : (
					<>
						<Moon className="h-4 w-4" />
						Modo Escuro
					</>
				)}
			</Button>
		);
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggleTheme}
			className={cn(
				'h-9 w-9 rounded-lg transition-colors',
				className
			)}
		>
			<Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			<span className="sr-only">Alternar tema</span>
		</Button>
	);
}
