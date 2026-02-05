import { useParams, useNavigate } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';
import { mockServers } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    RefreshCw,
    Settings,
    ArrowLeft,
    Terminal,
    Database,
    Globe,
    Layers,
    MessageSquare,
    Server,
    HardDrive,
    GitBranch,
    Clock,
    AlertTriangle,
    CheckCircle2,
    HelpCircle,
    Wrench,
    Bug,
    Zap,
    Shield,
    RotateCcw,
    ChevronDown
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
// import {
//     Accordion,
//     AccordionContent,
//     AccordionItem,
//     AccordionTrigger,
// } from '@/components/ui/accordion';
import { useState } from 'react';
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

// Flowcharts for maintenance help
const maintenanceFlowcharts = {
    database: {
        title: 'Manutenção de Banco de Dados',
        diagrams: [
            {
                id: 'db-slow',
                title: 'Banco de Dados Lento',
                icon: Bug,
                mermaid: `graph TD
    A[Banco Lento] --> B{Conexões ativas?}
    B -->|Alto| C[Verificar pool de conexões]
    B -->|Normal| D{Queries lentas?}
    C --> E[Aumentar pool ou matar conexões idle]
    D -->|Sim| F[Analisar EXPLAIN das queries]
    D -->|Não| G{Uso de CPU alto?}
    F --> H[Criar índices necessários]
    F --> I[Otimizar queries]
    G -->|Sim| J[Verificar processos em background]
    G -->|Não| K[Verificar I/O de disco]
    J --> L[Reagendar backups/vacuum]
    K --> M[Expandir storage ou migrar]`
            },
            {
                id: 'db-connection',
                title: 'Erro de Conexão',
                icon: AlertTriangle,
                mermaid: `graph TD
    A[Erro de Conexão] --> B{Serviço rodando?}
    B -->|Não| C[Iniciar serviço]
    B -->|Sim| D{Porta liberada?}
    D -->|Não| E[Verificar firewall]
    D -->|Sim| F{Credenciais corretas?}
    E --> G[Liberar porta no security group]
    F -->|Não| H[Atualizar credenciais]
    F -->|Sim| I{Limite de conexões?}
    I -->|Sim| J[Aumentar max_connections]
    I -->|Não| K[Verificar logs do serviço]
    C --> L[Verificar status]
    H --> L
    J --> L
    K --> L
    L --> M{Resolvido?}
    M -->|Sim| N[Documentar solução]
    M -->|Não| O[Escalar para suporte]`
            },
            {
                id: 'db-backup',
                title: 'Procedimento de Backup',
                icon: Shield,
                mermaid: `graph TD
    A[Iniciar Backup] --> B[Verificar espaço em disco]
    B --> C{Espaço suficiente?}
    C -->|Não| D[Limpar backups antigos]
    C -->|Sim| E[Pausar writes críticos]
    D --> B
    E --> F[Executar pg_dump/mysqldump]
    F --> G{Backup completo?}
    G -->|Não| H[Verificar logs de erro]
    G -->|Sim| I[Comprimir arquivo]
    H --> J[Resolver erro e retry]
    I --> K[Upload para storage remoto]
    K --> L[Verificar integridade]
    L --> M[Registrar log de backup]
    M --> N[Retomar operações normais]`
            }
        ]
    },
    api: {
        title: 'Manutenção de API',
        diagrams: [
            {
                id: 'api-error',
                title: 'Erros 500 Frequentes',
                icon: Bug,
                mermaid: `graph TD
    A[Erros 500] --> B[Verificar logs de aplicação]
    B --> C{Erro identificado?}
    C -->|Sim| D{É erro de código?}
    C -->|Não| E[Aumentar log level]
    D -->|Sim| F[Corrigir e deploy]
    D -->|Não| G{Timeout de DB?}
    E --> B
    G -->|Sim| H[Verificar conexão DB]
    G -->|Não| I{Memory leak?}
    H --> J[Ver fluxo de DB]
    I -->|Sim| K[Restart + investigar]
    I -->|Não| L[Verificar dependências externas]
    K --> M[Profile de memória]
    L --> N[Health check de APIs externas]`
            },
            {
                id: 'api-performance',
                title: 'Performance Degradada',
                icon: Zap,
                mermaid: `graph TD
    A[Latência Alta] --> B{CPU > 80%?}
    B -->|Sim| C[Escalar horizontalmente]
    B -->|Não| D{Memória > 80%?}
    C --> E[Adicionar instâncias]
    D -->|Sim| F[Verificar memory leaks]
    D -->|Não| G[Profile de requests]
    F --> H[Restart + monitor]
    G --> I{N+1 queries?}
    I -->|Sim| J[Implementar eager loading]
    I -->|Não| K{Cache implementado?}
    K -->|Não| L[Adicionar Redis cache]
    K -->|Sim| M[Verificar hit rate]
    M --> N[Ajustar TTL e invalidação]`
            },
            {
                id: 'api-deploy',
                title: 'Procedimento de Deploy',
                icon: RotateCcw,
                mermaid: `graph TD
    A[Iniciar Deploy] --> B[Rodar testes]
    B --> C{Testes passaram?}
    C -->|Não| D[Corrigir falhas]
    C -->|Sim| E[Build da aplicação]
    D --> B
    E --> F{Build OK?}
    F -->|Não| G[Verificar erros de build]
    F -->|Sim| H[Deploy em staging]
    H --> I[Smoke tests]
    I --> J{Staging OK?}
    J -->|Não| K[Rollback staging]
    J -->|Sim| L[Deploy em produção]
    L --> M[Health check]
    M --> N{Produção OK?}
    N -->|Não| O[Rollback imediato]
    N -->|Sim| P[Monitorar 15min]
    O --> Q[Investigar causa]`
            }
        ]
    },
    web: {
        title: 'Manutenção de Web App',
        diagrams: [
            {
                id: 'web-slow',
                title: 'Carregamento Lento',
                icon: Zap,
                mermaid: `graph TD
    A[Site Lento] --> B[Analisar Lighthouse]
    B --> C{LCP > 2.5s?}
    C -->|Sim| D[Otimizar imagens]
    C -->|Não| E{FID > 100ms?}
    D --> F[Lazy loading]
    E -->|Sim| G[Code splitting]
    E -->|Não| H{CLS > 0.1?}
    G --> I[Defer scripts]
    H -->|Sim| J[Definir dimensões]
    H -->|Não| K[Verificar bundle size]
    J --> L[Reservar espaço para ads]
    K --> M{Bundle > 500KB?}
    M -->|Sim| N[Tree shaking]
    M -->|Não| O[Verificar CDN]
    N --> P[Remover deps não usadas]`
            },
            {
                id: 'web-ssl',
                title: 'Certificado SSL',
                icon: Shield,
                mermaid: `graph TD
    A[Problema SSL] --> B{Certificado expirado?}
    B -->|Sim| C[Renovar certificado]
    B -->|Não| D{Mixed content?}
    C --> E[Instalar novo cert]
    D -->|Sim| F[Corrigir URLs HTTP]
    D -->|Não| G{Chain incompleta?}
    F --> H[Usar protocolo relativo]
    G -->|Sim| I[Baixar intermediários]
    G -->|Não| J{HSTS configurado?}
    I --> K[Atualizar bundle]
    J -->|Não| L[Adicionar header HSTS]
    J -->|Sim| M[Verificar redirect 301]
    E --> N[Testar com SSL Labs]
    K --> N
    L --> N`
            }
        ]
    },
    cache: {
        title: 'Manutenção de Cache',
        diagrams: [
            {
                id: 'cache-memory',
                title: 'Memória Cheia',
                icon: AlertTriangle,
                mermaid: `graph TD
    A[Cache Cheio] --> B[Verificar política de eviction]
    B --> C{LRU configurado?}
    C -->|Não| D[Configurar maxmemory-policy]
    C -->|Sim| E{Keys com TTL?}
    D --> F[Escolher allkeys-lru]
    E -->|Não| G[Definir EXPIRE nas keys]
    E -->|Sim| H{Hit rate baixo?}
    G --> I[Revisar código cliente]
    H -->|Sim| J[Aumentar memória]
    H -->|Não| K[Analisar keys grandes]
    J --> L[Escalar vertical]
    K --> M[Comprimir ou particionar]`
            },
            {
                id: 'cache-invalidation',
                title: 'Invalidação de Cache',
                icon: RotateCcw,
                mermaid: `graph TD
    A[Dados Desatualizados] --> B{Cache-aside pattern?}
    B -->|Não| C[Implementar invalidação]
    B -->|Sim| D{TTL muito longo?}
    C --> E[On write: delete cache]
    D -->|Sim| F[Reduzir TTL]
    D -->|Não| G{Write-through?}
    F --> H[Balancear freshness vs hit rate]
    G -->|Não| I[Implementar write-through]
    G -->|Sim| J[Verificar atomicidade]
    J --> K[Usar transações]
    I --> L[Update cache on write]`
            }
        ]
    },
    queue: {
        title: 'Manutenção de Filas',
        diagrams: [
            {
                id: 'queue-backlog',
                title: 'Fila Acumulando',
                icon: AlertTriangle,
                mermaid: `graph TD
    A[Backlog Grande] --> B{Consumers ativos?}
    B -->|Não| C[Iniciar consumers]
    B -->|Sim| D{Processamento lento?}
    C --> E[Verificar status]
    D -->|Sim| F[Profile do worker]
    D -->|Não| G{Muitos producers?}
    F --> H[Otimizar processamento]
    G -->|Sim| I[Rate limiting]
    G -->|Não| J[Escalar consumers]
    H --> K[Batch processing]
    I --> L[Implementar backpressure]
    J --> M[Adicionar workers]`
            },
            {
                id: 'queue-dlq',
                title: 'Dead Letter Queue',
                icon: Bug,
                mermaid: `graph TD
    A[Msgs na DLQ] --> B[Analisar mensagens]
    B --> C{Payload inválido?}
    C -->|Sim| D[Corrigir producer]
    C -->|Não| E{Timeout de processamento?}
    D --> F[Validar antes de enviar]
    E -->|Sim| G[Aumentar timeout]
    E -->|Não| H{Erro de dependência?}
    G --> I[Otimizar worker]
    H -->|Sim| J[Implementar retry com backoff]
    H -->|Não| K[Verificar logs do worker]
    J --> L[Circuit breaker]
    K --> M[Debug específico]`
            }
        ]
    },
    storage: {
        title: 'Manutenção de Storage',
        diagrams: [
            {
                id: 'storage-full',
                title: 'Disco Cheio',
                icon: AlertTriangle,
                mermaid: `graph TD
    A[Disco Cheio] --> B[Identificar maiores diretórios]
    B --> C{Logs antigos?}
    C -->|Sim| D[Configurar log rotation]
    C -->|Não| E{Backups locais?}
    D --> F[Limpar logs > 7 dias]
    E -->|Sim| G[Mover para storage remoto]
    E -->|Não| H{Arquivos temporários?}
    G --> I[Configurar lifecycle policy]
    H -->|Sim| J[Limpar /tmp e caches]
    H -->|Não| K[Expandir volume]
    J --> L[Cronjob de limpeza]
    K --> M[Resize EBS/disk]`
            },
            {
                id: 'storage-permissions',
                title: 'Erros de Permissão',
                icon: Shield,
                mermaid: `graph TD
    A[Permission Denied] --> B{Usuário correto?}
    B -->|Não| C[Verificar ownership]
    B -->|Sim| D{Permissões corretas?}
    C --> E[chown para usuário correto]
    D -->|Não| F[chmod adequado]
    D -->|Sim| G{SELinux/AppArmor?}
    F --> H[644 para arquivos, 755 para dirs]
    G -->|Sim| I[Verificar contexto de segurança]
    G -->|Não| J{Mounted corretamente?}
    I --> K[Ajustar políticas]
    J -->|Não| L[Verificar fstab]
    J -->|Sim| M[Verificar ACLs]`
            }
        ]
    }
};

export default function ServiceDetail() {
    const { serverId, serviceId } = useParams();
    const navigate = useNavigate();
    const [openItem, setOpenItem] = useState<string | null>(null);

    const server = mockServers.find(s => s.id === serverId);
    const service = server?.services.find(s => s.id === serviceId);

    if (!server || !service) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-muted-foreground mb-4">Serviço não encontrado</p>
                    <Button variant="outline" onClick={() => navigate('/servers')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para Servidores
                    </Button>
                </div>
            </MainLayout>
        );
    }

    const Icon = typeIcons[service.type];
    const maintenance = maintenanceFlowcharts[service.type];


    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/servers')}
                        className="-ml-2"
                    >
                        Servidores
                    </Button>
                    <span>/</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/servers/${serverId}`)}
                    >
                        {server.name}
                    </Button>
                    <span>/</span>
                    <span className="text-foreground">{service.name}</span>
                </div>

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className={`p-4 rounded-xl ${typeColors[service.type]}`}>
                            <Icon className="h-8 w-8" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight">{service.name}</h1>
                                <StatusBadge status={service.status} />
                            </div>
                            <p className="text-muted-foreground capitalize mt-1">{service.type}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" variant="secondary">
                            <RefreshCw className="mr-2 h-4 w-4" /> Redeploy
                        </Button>
                        <Button size="sm" variant="outline">
                            <Terminal className="mr-2 h-4 w-4" /> Logs
                        </Button>
                        <Button size="sm" variant="outline">
                            <Settings className="mr-2 h-4 w-4" /> Config
                        </Button>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-xl border border-border bg-card p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <GitBranch className="h-4 w-4" />
                            <span>Versão</span>
                        </div>
                        <p className="font-mono font-semibold text-lg">{service.version}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Globe className="h-4 w-4" />
                            <span>Porta</span>
                        </div>
                        <p className="font-mono font-semibold text-lg">{service.port}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Clock className="h-4 w-4" />
                            <span>Último Deploy</span>
                        </div>
                        <p className="font-semibold">{format(service.lastDeployment, 'dd MMM yyyy', { locale: ptBR })}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Server className="h-4 w-4" />
                            <span>Servidor</span>
                        </div>
                        <p className="font-mono font-semibold truncate">{server.name}</p>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="help" className="w-full">
                    <TabsList>
                        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                        <TabsTrigger value="logs">Logs</TabsTrigger>
                        <TabsTrigger value="metrics">Métricas</TabsTrigger>
                        <TabsTrigger value="help" className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4" />
                            Ajuda & Manutenção
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6">
                        <div className="rounded-xl border border-border bg-card p-6">
                            <h3 className="font-semibold mb-4">Informações do Serviço</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b border-border">
                                        <span className="text-muted-foreground">Tipo</span>
                                        <span className="font-medium capitalize">{service.type}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-border">
                                        <span className="text-muted-foreground">Status</span>
                                        <StatusBadge status={service.status} size="sm" />
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-border">
                                        <span className="text-muted-foreground">Versão</span>
                                        <span className="font-mono">{service.version}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b border-border">
                                        <span className="text-muted-foreground">Porta</span>
                                        <span className="font-mono">{service.port}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-border">
                                        <span className="text-muted-foreground">Servidor</span>
                                        <span className="font-mono">{server.name}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-border">
                                        <span className="text-muted-foreground">Último Deploy</span>
                                        <span>{format(service.lastDeployment, 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="logs" className="mt-6">
                        <div className="rounded-xl border border-border bg-secondary/20 p-4 font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
                            <p className="text-success">[2024-01-20 14:32:15] INFO: Service health check passed</p>
                            <p className="text-muted-foreground">[2024-01-20 14:30:00] DEBUG: Processing request #4521</p>
                            <p className="text-muted-foreground">[2024-01-20 14:28:45] DEBUG: Connection pool refreshed</p>
                            <p className="text-warning">[2024-01-20 14:25:12] WARN: High memory usage detected (78%)</p>
                            <p className="text-success">[2024-01-20 14:20:00] INFO: Backup completed successfully</p>
                            <p className="text-muted-foreground">[2024-01-20 14:15:30] DEBUG: Cache invalidated for key user:1234</p>
                            <p className="text-success">[2024-01-20 14:10:00] INFO: Deploy v{service.version} completed</p>
                            <p className="text-destructive">[2024-01-20 14:05:22] ERROR: Connection timeout to external API</p>
                            <p className="text-success">[2024-01-20 14:05:25] INFO: Retry successful</p>
                            <p className="text-muted-foreground">[2024-01-20 14:00:00] DEBUG: Scheduled task executed</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="metrics" className="mt-6">
                        <div className="rounded-xl border border-border bg-card p-6 text-center">
                            <p className="text-muted-foreground">Gráficos de métricas em tempo real</p>
                            <p className="text-sm text-muted-foreground mt-2">Requer integração com sistema de monitoramento</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="help" className="mt-6">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 p-4 rounded-xl border border-primary/30 bg-primary/5">
                                <Wrench className="h-6 w-6 text-primary" />
                                <div>
                                    <h3 className="font-semibold">{maintenance.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Fluxogramas interativos para diagnóstico e resolução de problemas
                                    </p>
                                </div>
                            </div>

                            <div className="w-full space-y-2">
                                {maintenance.diagrams.map((diagram) => {
                                    const DiagramIcon = diagram.icon;
                                    const isOpen = openItem === diagram.id;

                                    return (
                                        <div
                                            key={diagram.id}
                                            className={`border border-border rounded-xl px-4 transition-colors ${isOpen ? 'border-primary/30' : ''}`}
                                        >
                                            <button
                                                onClick={() => setOpenItem(isOpen ? null : diagram.id)}
                                                className="flex w-full items-center justify-between py-4 font-medium transition-all hover:underline"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <DiagramIcon className="h-5 w-5 text-primary" />
                                                    <span className="font-medium">{diagram.title}</span>
                                                </div>
                                                <ChevronDown
                                                    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                                />
                                            </button>

                                            <div
                                                className={`overflow-hidden text-sm transition-all duration-300 ${isOpen ? 'max-h-[500px] pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
                                            >
                                                <div className="rounded-lg bg-secondary/30 p-4 overflow-x-auto">
                                                    <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                                                        {diagram.mermaid}
                                                    </pre>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-4">
                                                    💡 Este fluxograma representa o processo de diagnóstico passo a passo.
                                                    Siga as decisões para identificar e resolver o problema.
                                                </p>
                                                <div className="flex gap-2 mt-4">
                                                    <Button size="sm" variant="outline">
                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                                        Marcar como Resolvido
                                                    </Button>
                                                    <Button size="sm" variant="outline">
                                                        <AlertTriangle className="mr-2 h-4 w-4" />
                                                        Escalar para Suporte
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-xl border border-border bg-card p-4">
                                    <h4 className="font-medium mb-3 flex items-center gap-2">
                                        <Terminal className="h-4 w-4 text-primary" />
                                        Comandos Úteis
                                    </h4>
                                    <div className="space-y-2 font-mono text-sm">
                                        {service.type === 'database' && (
                                            <>
                                                <code className="block p-2 bg-secondary rounded">pg_stat_activity</code>
                                                <code className="block p-2 bg-secondary rounded">EXPLAIN ANALYZE [query]</code>
                                                <code className="block p-2 bg-secondary rounded">VACUUM ANALYZE</code>
                                            </>
                                        )}
                                        {service.type === 'api' && (
                                            <>
                                                <code className="block p-2 bg-secondary rounded">pm2 logs</code>
                                                <code className="block p-2 bg-secondary rounded">pm2 restart all</code>
                                                <code className="block p-2 bg-secondary rounded">curl -I localhost:{service.port}/health</code>
                                            </>
                                        )}
                                        {service.type === 'cache' && (
                                            <>
                                                <code className="block p-2 bg-secondary rounded">redis-cli INFO memory</code>
                                                <code className="block p-2 bg-secondary rounded">redis-cli MONITOR</code>
                                                <code className="block p-2 bg-secondary rounded">redis-cli DBSIZE</code>
                                            </>
                                        )}
                                        {(service.type === 'web' || service.type === 'queue' || service.type === 'storage') && (
                                            <>
                                                <code className="block p-2 bg-secondary rounded">systemctl status {service.name.toLowerCase()}</code>
                                                <code className="block p-2 bg-secondary rounded">journalctl -u {service.name.toLowerCase()} -f</code>
                                                <code className="block p-2 bg-secondary rounded">tail -f /var/log/{service.name.toLowerCase()}.log</code>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="rounded-xl border border-border bg-card p-4">
                                    <h4 className="font-medium mb-3 flex items-center gap-2">
                                        <HelpCircle className="h-4 w-4 text-primary" />
                                        Documentação Rápida
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <a href="#" className="block p-2 bg-secondary rounded hover:bg-secondary/80 transition-colors">
                                            📄 Guia de Configuração
                                        </a>
                                        <a href="#" className="block p-2 bg-secondary rounded hover:bg-secondary/80 transition-colors">
                                            🔧 Troubleshooting Comum
                                        </a>
                                        <a href="#" className="block p-2 bg-secondary rounded hover:bg-secondary/80 transition-colors">
                                            📊 Métricas e Alertas
                                        </a>
                                        <a href="#" className="block p-2 bg-secondary rounded hover:bg-secondary/80 transition-colors">
                                            🚀 Procedimentos de Deploy
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    );
}
