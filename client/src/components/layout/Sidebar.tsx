import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
	LayoutDashboard,
	FileText,
	FolderTree,
	Users,
	LogOut,
	ChevronRight,

	FileDown,
	Video,
	Zap,
	Sun,
	Moon,
	MessageSquare,
	BarChart3,
	Home,
	Contact,
	Wrench,
	LineChart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useSidebarStore } from '@/stores/sidebarStore';
import { ChevronLeft } from 'lucide-react';
import { SIDEBAR_CONFIG } from '@/constants/sidebarConfig';
/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

interface SidebarItem {
	to: string;
	icon: any;
	label: string;
	adminOnly?: boolean;
	technicianOnly?: boolean;
	ownerDeveloperOnly?: boolean;
}

interface SidebarSection {
	id: string;
	label: string;
	adminOnly?: boolean;
	technicianOnly?: boolean;
	ownerDeveloperOnly?: boolean;
	items: SidebarItem[];
}

interface SidebarProps {
	mobile?: boolean;
	onNavigate?: () => void;
}

export function Sidebar({ mobile, onNavigate }: SidebarProps) {
	const { user, logout } = useAuth();
	const { theme, setTheme } = useTheme();
	const location = useLocation();
	const navigate = useNavigate();
	const { isCollapsed, toggle: toggleCollapsed } = useSidebarStore();

	const handleNavigate = () => onNavigate?.();

	const toggleTheme = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark');
	};

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<aside
			className={cn(
				'h-screen bg-sidebar border-sidebar-border flex flex-col transition-all duration-300',
				isCollapsed ? 'w-20' : 'w-80',
				mobile ? 'w-full' : 'fixed left-0 top-0 z-40 hidden md:flex'
			)}
		>
			{/* ------------------------------------------------------------------ */}
			{/* Header */}
			{/* ------------------------------------------------------------------ */}
			<div className={cn(
				"flex items-center justify-between py-6",
				isCollapsed ? "flex-col gap-4 px-2" : "px-5"
			)}>
				<div className="shrink-0">
					<img src="/logo.png" alt="Athena Logo" className={cn(
						"transition-all duration-300",
						isCollapsed ? "w-10 h-10" : "w-12 h-12"
					)} />
				</div>

				<div className={cn(
					"flex items-center gap-1",
					isCollapsed && "flex-col"
				)}>
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleTheme}
						className="text-sidebar-foreground hover:text-primary transition-colors h-8 w-8"
						title="Alternar tema"
					>
						{theme === 'dark' ? (
							<Sun className="h-4 w-4" />
						) : (
							<Moon className="h-4 w-4" />
						)}
					</Button>

					<Button
						variant="ghost"
						size="icon"
						onClick={toggleCollapsed}
						className="text-sidebar-foreground hover:text-primary transition-colors h-8 w-8"
						title={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
					>
						<ChevronLeft className={cn(
							"h-4 w-4 transition-transform duration-300",
							isCollapsed && "rotate-180"
						)} />
					</Button>
				</div>
			</div>

			<Separator className="bg-sidebar-border" />

			{/* ------------------------------------------------------------------ */}
			{/* Navigation */}
			{/* ------------------------------------------------------------------ */}
			<nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar">
				{SIDEBAR_CONFIG.map((section, idx) => {
					return (
						<div key={section.id} className="space-y-1">
							{idx > 0 && (
								<Separator className="my-3 bg-sidebar-border/50" />
							)}

							{/* Section Header - Static */}
							{!isCollapsed && (
								<div
									className="w-full flex items-center justify-between px-3 py-1.5"
								>
									<p className="text-[10px] font-bold text-sidebar-foreground/40 uppercase tracking-[0.2em]">
										{section.label}
									</p>
								</div>
							)}

							{/* Section Items */}
							<div className="space-y-1 animate-fade-in">
								{section.items.map(({ label, to, icon: Icon }) => {
									const isActive = location.pathname === to;

									return (
										<NavLink key={to} to={to} onClick={handleNavigate}>
											<Button
												variant={isActive ? 'sidebarActive' : 'sidebar'}
												size="sidebar"
												className={cn(
													'w-full group shadow-none transition-all duration-300',
													isCollapsed ? 'px-0 justify-center' : 'justify-start gap-3',
													isActive && 'shadow-sm'
												)}
												title={isCollapsed ? label : undefined}
											>
												<Icon
													className={cn(
														'h-5 w-5 transition-colors shrink-0',
														isActive
															? 'text-foreground'
															: 'text-sidebar-foreground/70 group-hover:text-primary',
														isCollapsed && 'w-6 h-6'
													)}
												/>
												{!isCollapsed && <span className="flex-1 text-left">{label}</span>}
												{(isActive && !isCollapsed) && (
													<ChevronRight className="h-4 w-4 text-primary/60" />
												)}
											</Button>
										</NavLink>
									);
								})}
							</div>
						</div>
					);
				})}
			</nav>

			{/* ------------------------------------------------------------------ */}
			{/* User / Session */}
			{/* ------------------------------------------------------------------ */}
			<div className={cn(
				"border-t border-sidebar-border bg-sidebar-accent/5 space-y-4 transition-all duration-300",
				isCollapsed ? "p-2 items-center flex flex-col" : "p-5"
			)}>
				{/* #TODO: mudar a pagina para profile depois */}
				<NavLink to="/dashboard" className={cn(
					"flex items-center gap-3 hover:bg-sidebar-accent/50 rounded-lg transition-colors group",
					isCollapsed ? "p-1" : "px-2 p-2"
				)}>
					<div className={cn(
						"flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold ring-2 ring-primary/5 group-hover:ring-primary/20 transition-all shrink-0",
						isCollapsed ? "h-8 w-8 text-[10px]" : "h-10 w-10 text-xs"
					)}>
						{user?.name?.charAt(0).toUpperCase()}
					</div>

					{!isCollapsed && (
						<div className="flex-1 min-w-0">
							<p className="text-sm font-semibold text-sidebar-foreground truncate tracking-tight group-hover:text-primary transition-colors">
								{user?.name}
							</p>
							<p className="text-[11px] text-sidebar-foreground/50 truncate leading-none mt-0.5">
								{user?.email}
							</p>
						</div>
					)}
				</NavLink>

				<Button
					variant="ghost"
					size="sm"
					onClick={handleLogout}
					className={cn(
						"w-full justify-start transition-all rounded-lg h-10 text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10",
						isCollapsed ? "px-0 justify-center" : "gap-2.5 px-4"
					)}
					title={isCollapsed ? "Sair da Conta" : undefined}
				>
					<LogOut className="h-4 w-4" />
					{!isCollapsed && <span className="text-xs font-medium">Sair da Conta</span>}
				</Button>
			</div>
		</aside>
	);
}
