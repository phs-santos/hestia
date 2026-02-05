import { useNavigate, useParams } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';
import { mockServers } from '@/data/mockData';
import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
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
    Plus,
    ArrowLeft,
    Terminal,
    Layers,
    ChevronRight,
    Database,
    Server,
    MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Service } from '@/types/infrastructure';
import { MainLayout } from '@/layouts/MainLayout';

const typeIcons = {
    database: Database,
    api: Server,
    web: Globe,
    cache: Layers,
    queue: MessageSquare,
    storage: HardDrive,
};

const typeColors = {
    database: 'text-info bg-info/10',
    api: 'text-success bg-success/10',
    web: 'text-primary bg-primary/10',
    cache: 'text-warning bg-warning/10',
    queue: 'text-purple-400 bg-purple-400/10',
    storage: 'text-orange-400 bg-orange-400/10',
};

export default function ServerDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const server = mockServers.find(s => s.id === id);

    if (!server) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-muted-foreground mb-4">Servidor não encontrado</p>
                    <Button variant="outline" onClick={() => navigate('/servers')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para Servidores
                    </Button>
                </div>
            </MainLayout>
        );
    }

    const handleServiceClick = (service: Service) => {
        navigate(`/servers/${server.id}/services/${service.id}`);
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/servers')}
                            className="mb-2 -ml-2"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Servidores
                        </Button>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight font-mono">{server.name}</h1>
                            <StatusBadge status={server.status} />
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Globe className="h-4 w-4" />
                            <span>{server.ip}</span>
                            <span>•</span>
                            <span>{server.region}</span>
                        </div>
                    </div>
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
                            <Terminal className="mr-2 h-4 w-4" /> Terminal
                        </Button>
                        <Button size="sm" variant="outline">
                            <Settings className="mr-2 h-4 w-4" /> Config
                        </Button>
                    </div>
                </div>

                {/* Resource Usage */}
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-xl border border-border bg-card p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Cpu className="h-4 w-4 text-primary" />
                                <span>CPU</span>
                            </div>
                            <span className="font-mono font-semibold">{server.cpu}%</span>
                        </div>
                        {/* <Progress value={server.cpu} className="h-2" /> */}
                        <div className="h-2 w-full rounded-full bg-secondary">
                            <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${server.cpu}%` }}
                            />
                        </div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MemoryStick className="h-4 w-4 text-info" />
                                <span>Memória</span>
                            </div>
                            <span className="font-mono font-semibold">{server.memory}%</span>
                        </div>
                        {/* <Progress value={server.memory} className="h-2" /> */}
                        <div className="h-2 w-full rounded-full bg-secondary">
                            <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${server.memory}%` }}
                            />
                        </div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <HardDrive className="h-4 w-4 text-warning" />
                                <span>Armazenamento</span>
                            </div>
                            <span className="font-mono font-semibold">{server.storage}%</span>
                        </div>
                        {/* <Progress value={server.storage} className="h-2" /> */}
                        <div className="h-2 w-full rounded-full bg-secondary">
                            <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${server.storage}%` }}
                            />
                        </div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-5">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Uptime</p>
                            <p className="font-mono font-semibold text-lg">{server.uptime}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Criado em {format(server.createdAt, 'dd MMM yyyy', { locale: ptBR })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Serviços ({server.services.length})</h2>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar Serviço
                        </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {server.services.map((service) => {
                            const Icon = typeIcons[service.type];
                            return (
                                <div
                                    key={service.id}
                                    onClick={() => handleServiceClick(service)}
                                    className="group relative rounded-xl border border-border bg-card p-5 cursor-pointer transition-all hover:border-primary/30 hover:shadow-glow"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-lg ${typeColors[service.type]}`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <StatusBadge status={service.status} size="sm" />
                                    </div>
                                    <h3 className="font-semibold mb-1">{service.name}</h3>
                                    <p className="text-sm text-muted-foreground capitalize mb-3">{service.type}</p>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span className="font-mono">{service.version}</span>
                                        <span>Port {service.port}</span>
                                    </div>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight className="h-5 w-5 text-primary" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {server.services.length === 0 && (
                        <div className="text-center py-12 rounded-xl border border-dashed border-border">
                            <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-4">Nenhum serviço configurado</p>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Primeiro Serviço
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout >
    );
}
