import { SidebarSection } from "@/types/sidebar";
import { LayoutDashboard, Trees } from "lucide-react";

export const SIDEBAR_CONFIG: SidebarSection[] = [
    {
        id: 'dashboard-group',
        items: [
            { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        ]
    },
    {
        id: 'example',
        label: 'Exemplo',
        items: [
            { to: '/#', icon: Trees, label: 'Pagina de Exemplo' },
        ]
    }
];