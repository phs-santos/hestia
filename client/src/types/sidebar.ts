export interface SidebarItem {
    to: string;
    icon: any;
    label: string;
}

export interface SidebarSection {
    id: string;
    label?: string;
    items: SidebarItem[];
}