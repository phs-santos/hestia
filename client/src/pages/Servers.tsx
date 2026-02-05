import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus, Server as ServerIcon, MoreVertical, ExternalLink, Shield, Globe, Trash2, Edit } from 'lucide-react';
import { monitoringService, Server } from '@/features/monitoring';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Servers() {
    const [servers, setServers] = useState<Server[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadServers();
    }, []);

    const loadServers = async () => {
        try {
            setIsLoading(true);
            const data = await monitoringService.getServers();
            setServers(data);
        } catch (error: any) {
            toast.error('Erro ao carregar servidores', {
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja remover este servidor?')) return;
        try {
            await monitoringService.deleteServer(id);
            toast.success('Servidor removido com sucesso');
            loadServers();
        } catch (error: any) {
            toast.error('Erro ao remover servidor', {
                description: error.message,
            });
        }
    };

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Servidores</h1>
                    <p className="text-muted-foreground mt-1">Gerencie a infraestrutura física e virtual</p>
                </div>

                <Button className="gap-2 shadow-lg hover:shadow-primary/20 transition-all">
                    <Plus className="h-4 w-4" />
                    Adicionar Servidor
                </Button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse bg-muted/50 border-none h-48" />
                    ))}
                </div>
            ) : servers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed border-muted">
                    <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <ServerIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Nenhum servidor cadastrado</h3>
                    <p className="text-muted-foreground mb-6">Comece adicionando seu primeiro servidor à lista</p>
                    <Button variant="outline" onClick={loadServers}>Atualizar lista</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {servers.map((server) => (
                        <Card key={server.id} className="group hover:ring-2 hover:ring-primary/20 transition-all duration-300 overflow-hidden bg-card/50 backdrop-blur-sm">
                            <CardHeader className="flex flex-row items-start justify-between pb-2">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-xl font-bold">{server.name}</CardTitle>
                                        <Badge variant={server.environment === 'prod' ? 'destructive' : 'secondary'} className="text-[10px] py-0">
                                            {(server.environment || 'dev').toUpperCase()}
                                        </Badge>
                                    </div>
                                    <CardDescription className="flex items-center gap-1.5 font-mono text-xs">
                                        <Globe className="h-3 w-3" /> {server.host}
                                    </CardDescription>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="-mt-2 -mr-2">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem className="gap-2">
                                            <Edit className="h-4 w-4" /> Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(server.id)}>
                                            <Trash2 className="h-4 w-4" /> Remover
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                                        {server.description || 'Sem descrição definida'}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-muted">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Shield className="h-3 w-3" />
                                            <span>{server.provider || 'Local'}</span>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs hover:text-primary p-0">
                                            Ver Serviços <ExternalLink className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </MainLayout>
    );
}
