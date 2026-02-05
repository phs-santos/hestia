import { ActivityLog } from '@/types/infrastructure';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActivityFeedProps {
    activities: ActivityLog[];
}

const statusIcons = {
    success: CheckCircle2,
    pending: Clock,
    failed: XCircle,
};

const statusColors = {
    success: 'text-success',
    pending: 'text-info',
    failed: 'text-destructive',
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
    return (
        <div className="space-y-1">
            {activities.map((activity, index) => {
                const Icon = statusIcons[activity.status];
                return (
                    <div
                        key={activity.id}
                        className={cn(
                            'flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-secondary/50',
                            index === 0 && 'bg-secondary/30'
                        )}
                    >
                        <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', statusColors[activity.status])} />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm">
                                <span className="font-medium">{activity.action}</span>
                                <span className="text-muted-foreground"> em </span>
                                <span className="font-mono text-primary">{activity.serverName}</span>
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <span>{activity.user}</span>
                                <span>•</span>
                                <span>{formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: ptBR })}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
