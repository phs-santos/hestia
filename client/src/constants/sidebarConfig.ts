import { SidebarSection } from "@/types/sidebar";
import { LayoutDashboard, Server, Activity, Package } from "lucide-react";

export const SIDEBAR_CONFIG: SidebarSection[] = [
    {
        id: 'dashboard-group',
        featureId: 'dashboard',
        items: [
            { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        ]
    },
    {
        id: 'monitoring',
        label: 'Monitoramento',
        featureId: 'monitoring',
        items: [
            { to: '/servers', icon: Server, label: 'Servidores', featureId: 'monitoring-servers' },
            { to: '/services', icon: Activity, label: 'Serviços', featureId: 'monitoring-services' },
        ]
    },
    {
        id: 'products',
        label: 'Gestão de Produtos',
        featureId: 'products',
        items: [
            { to: '/products', icon: Package, label: 'Produtos', featureId: 'products-list' },
        ]
    }
];