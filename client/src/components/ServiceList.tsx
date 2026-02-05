import { Service } from '@/types/infrastructure';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import {
    Database,
    Globe,
    Layers,
    HardDrive,
    MessageSquare,
    Server,
    MoreVertical,
    RefreshCw,
    Trash2,
    Settings
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ServiceListProps {
    services: Service[];
}

const typeIcons = {
    database: Database,
    api: Server,
    web: Globe,
    cache: Layers,
    queue: MessageSquare,
    storage: HardDrive,
};

const typeColors = {
    database: 'text-info',
    api: 'text-success',
    web: 'text-primary',
    cache: 'text-warning',
    queue: 'text-purple-400',
    storage: 'text-orange-400',
};

export function ServiceList({ services }: ServiceListProps) {
    return (
        <div className="space-y-2">
            {services.map((service) => {
                const Icon = typeIcons[service.type];
                return (
                    <div
                        key={service.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg bg-secondary ${typeColors[service.type]}`}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-medium">{service.name}</h4>
                                    <StatusBadge status={service.status} size="sm" />
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                    <span className="font-mono">{service.version}</span>
                                    <span>•</span>
                                    <span>Port {service.port}</span>
                                    <span>•</span>
                                    <span>Deploy: {format(service.lastDeployment, 'dd MMM yyyy', { locale: ptBR })}</span>
                                </div>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <RefreshCw className="mr-2 h-4 w-4" /> Redeploy
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" /> Configurar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" /> Remover
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            })}
        </div>
    );
}
