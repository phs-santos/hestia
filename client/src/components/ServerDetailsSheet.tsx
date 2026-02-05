import { Server } from '@/types/infrastructure';
import { StatusBadge } from '@/components/StatusBadge';
import { ServiceList } from '@/components/ServiceList';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Play,
    Square,
    RefreshCw,
    Settings,
    Cpu,
    HardDrive,
    MemoryStick,
    Globe,
    Calendar,
    Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ServerDetailsSheetProps {
    server: Server | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ServerDetailsSheet({ server, open, onOpenChange }: ServerDetailsSheetProps) {
    if (!server) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                <SheetHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="font-mono text-xl">{server.name}</SheetTitle>
                        <StatusBadge status={server.status} />
                    </div>
                    <SheetDescription className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        {server.ip} • {server.region}
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Quick Actions */}
                    <div className="flex gap-2">
                        <Button size="sm" variant="secondary">
                            <Play className="mr-2 h-4 w-4" /> Start
                        </Button>
                        <Button size="sm" variant="secondary">
                            <Square className="mr-2 h-4 w-4" /> Stop
                        </Button>
                        <Button size="sm" variant="secondary">
                            <RefreshCw className="mr-2 h-4 w-4" /> Restart
                        </Button>
                        <Button size="sm" variant="outline">
                            <Settings className="mr-2 h-4 w-4" /> Config
                        </Button>
                    </div>

                    {/* Resource Usage */}
                    <div className="rounded-lg border border-border bg-secondary/20 p-4 space-y-4">
                        <h4 className="font-medium text-sm text-muted-foreground">Uso de Recursos</h4>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <Cpu className="h-4 w-4 text-primary" />
                                        <span>CPU</span>
                                    </div>
                                    <span className="font-mono">{server.cpu}%</span>
                                </div>
                                {/* <Progress value={server.cpu} className="h-2" /> */}
                                <div className="h-2 w-full rounded-full bg-secondary">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all"
                                        style={{ width: `${server.cpu}%` }}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <MemoryStick className="h-4 w-4 text-info" />
                                        <span>Memória</span>
                                    </div>
                                    <span className="font-mono">{server.memory}%</span>
                                </div>
                                {/* <Progress value={server.memory} className="h-2" /> */}
                                <div className="h-2 w-full rounded-full bg-secondary">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all"
                                        style={{ width: `${server.memory}%` }}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <HardDrive className="h-4 w-4 text-warning" />
                                        <span>Armazenamento</span>
                                    </div>
                                    <span className="font-mono">{server.storage}%</span>
                                </div>
                                {/* <Progress value={server.storage} className="h-2" /> */}
                                <div className="h-2 w-full rounded-full bg-secondary">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all"
                                        style={{ width: `${server.storage}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                            <p className="text-muted-foreground">Uptime</p>
                            <p className="font-mono font-medium">{server.uptime}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground">Criado em</p>
                            <p className="font-medium flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {format(server.createdAt, 'dd MMM yyyy', { locale: ptBR })}
                            </p>
                        </div>
                    </div>

                    {/* Services */}
                    <Tabs defaultValue="services" className="w-full">
                        <TabsList className="w-full">
                            <TabsTrigger value="services" className="flex-1">
                                Serviços ({server.services.length})
                            </TabsTrigger>
                            <TabsTrigger value="logs" className="flex-1">
                                Logs
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="services" className="mt-4 space-y-4">
                            <Button variant="outline" size="sm" className="w-full">
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Serviço
                            </Button>
                            <ServiceList services={server.services} />
                        </TabsContent>
                        <TabsContent value="logs" className="mt-4">
                            <div className="rounded-lg bg-secondary/20 p-4 font-mono text-xs text-muted-foreground space-y-1 max-h-64 overflow-y-auto">
                                <p>[2024-01-20 14:32:15] INFO: Server health check passed</p>
                                <p>[2024-01-20 14:30:00] INFO: Metrics collected successfully</p>
                                <p>[2024-01-20 14:28:45] DEBUG: Connection pool refreshed</p>
                                <p>[2024-01-20 14:25:12] INFO: Backup completed</p>
                                <p>[2024-01-20 14:20:00] INFO: Certificate validation passed</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </SheetContent>
        </Sheet>
    );
}
