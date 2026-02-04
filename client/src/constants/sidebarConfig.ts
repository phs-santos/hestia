import { SidebarSection } from "@/types/sidebar";
import { LayoutDashboard, Server, Activity } from "lucide-react";

export const SIDEBAR_CONFIG: SidebarSection[] = [
    {
        id: 'dashboard-group',
        items: [
            { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        ]
    },
    {
        id: 'monitoring',
        label: 'Monitoramento',
        items: [
            { to: '/servers', icon: Server, label: 'Servidores' },
            { to: '/services', icon: Activity, label: 'Serviços' },
        ]
    }
];