import { cn } from '@/lib/utils';
import { ServerStatus, ServiceStatus } from '@/types/infrastructure';

interface StatusBadgeProps {
    status: ServerStatus | ServiceStatus;
    size?: 'sm' | 'md';
}

const statusConfig = {
    running: { label: 'Running', className: 'bg-success/20 text-success border-success/30' },
    healthy: { label: 'Healthy', className: 'bg-success/20 text-success border-success/30' },
    stopped: { label: 'Stopped', className: 'bg-muted text-muted-foreground border-border' },
    down: { label: 'Down', className: 'bg-destructive/20 text-destructive border-destructive/30' },
    maintenance: { label: 'Maintenance', className: 'bg-warning/20 text-warning border-warning/30' },
    degraded: { label: 'Degraded', className: 'bg-warning/20 text-warning border-warning/30' },
    error: { label: 'Error', className: 'bg-destructive/20 text-destructive border-destructive/30' },
    pending: { label: 'Pending', className: 'bg-info/20 text-info border-info/30' },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full border font-medium',
                config.className,
                size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
            )}
        >
            <span className={cn(
                'rounded-full animate-pulse',
                size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
                status === 'running' || status === 'healthy' ? 'bg-success' :
                    status === 'stopped' || status === 'down' ? 'bg-muted-foreground' :
                        status === 'maintenance' || status === 'degraded' ? 'bg-warning' :
                            status === 'pending' ? 'bg-info' : 'bg-destructive'
            )} />
            {config.label}
        </span>
    );
}
