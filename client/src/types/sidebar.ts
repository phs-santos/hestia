export interface SidebarItem {
    to: string;
    icon: any;
    label: string;
    featureId?: string;
}

export interface SidebarSection {
    id: string;
    label?: string;
    featureId?: string;
    items: SidebarItem[];
}