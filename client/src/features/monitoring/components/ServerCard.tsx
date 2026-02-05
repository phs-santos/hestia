import { Server } from '@/types/infrastructure';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    MoreVertical,
    Play,
    Square,
    RefreshCw,
    Settings,
    Cpu,
    HardDrive,
    MemoryStick,
    Globe
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ServerCardProps {
    server: Server;
    onSelect: (server: Server) => void;
}

/**
 * Normaliza qualquer valor para número entre 0 e 100
 * Evita crash no Radix Progress
 */
function normalizePercent(value: unknown): number {
    // console.log('normalizePercent value:', value, typeof value);
    const num = Number(value);
    if (Number.isNaN(num)) return 0;
    return Math.min(100, Math.max(0, num));
}

export function ServerCard({ server, onSelect }: ServerCardProps) {
    // 🔒 Valores SEMPRE numéricos
    const cpu = normalizePercent(server.cpu);
    const memory = normalizePercent(server.memory);
    const storage = normalizePercent(server.storage);

    return (
        <div
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-glow"
            onClick={() => onSelect(server)}
        >
            {/* HEADER */}
            <div className="mb-4 flex items-start justify-between">
                <div className="space-y-1">
                    <h3 className="font-mono text-lg font-semibold">
                        {server.name}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Globe className="h-3.5 w-3.5" />
                        <span>{server.ip}</span>
                        <span className="text-border">•</span>
                        <span>{server.region}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <StatusBadge status={server.status} />

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Play className="mr-2 h-4 w-4" />
                                Start
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Square className="mr-2 h-4 w-4" />
                                Stop
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Restart
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* METRICS */}
            <div className="mb-4 grid grid-cols-3 gap-4">
                {/* CPU */}
                <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        {/* <Cpu className="h-3.5 w-3.5" /> */}
                        <span>CPU</span>
                    </div>

                    {/* <Progress value={cpu} className="h-1.5" /> */}
                    <div className="h-1.5 w-full rounded-full bg-secondary">
                        <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${cpu}%` }}
                        />
                    </div>
                    <span className="font-mono text-xs">{cpu}%</span>
                </div>

                {/* RAM */}
                <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        {/* <MemoryStick className="h-3.5 w-3.5" /> */}
                        <span>RAM</span>
                    </div>

                    {/* <Progress value={memory} className="h-1.5" /> */}
                    <div className="h-1.5 w-full rounded-full bg-secondary">
                        <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${memory}%` }}
                        />
                    </div>
                    <span className="font-mono text-xs">{memory}%</span>
                </div>

                {/* DISK */}
                <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        {/* <HardDrive className="h-3.5 w-3.5" /> */}
                        <span>Disk</span>
                    </div>

                    {/* <Progress value={storage} className="h-1.5" /> */}
                    <div className="h-1.5 w-full rounded-full bg-secondary">
                        <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${storage}%` }}
                        />
                    </div>
                    <span className="font-mono text-xs">{storage}%</span>
                </div>
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                        Services:
                    </span>
                    <span className="text-xs font-semibold">
                        {server.services.length}
                    </span>
                </div>

                <div className="text-xs text-muted-foreground">
                    Uptime:{' '}
                    <span className="font-mono text-foreground">
                        {server.uptime}
                    </span>
                </div>
            </div>

            {/* Glow */}
            <div className="pointer-events-none absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-primary/5 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
    );
}