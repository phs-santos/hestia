import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus, Activity, MoreVertical, Globe, Trash2, Edit, Cpu, Settings } from 'lucide-react';
import { Service } from '@/types/infrastructure';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { monitoringService } from '../api/monitoringService';

export default function Services() {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            setIsLoading(true);
            const data = await monitoringService.getServices();
            setServices(data);
        } catch (error: any) {
            toast.error('Erro ao carregar serviços', {
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja remover este serviço?')) return;
        try {
            await monitoringService.deleteService(id);
            toast.success('Serviço removido com sucesso');
            loadServices();
        } catch (error: any) {
            toast.error('Erro ao remover serviço', {
                description: error.message,
            });
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'running': return 'success';
            case 'stopped': return 'secondary';
            case 'degraded': return 'warning';
            case 'failed': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Serviços</h1>
                    <p className="text-muted-foreground mt-1">Status e controle das aplicações em execução</p>
                </div>

                <Button className="gap-2 shadow-lg hover:shadow-primary/20 transition-all">
                    <Plus className="h-4 w-4" />
                    Novo Serviço
                </Button>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-none shadow-xl">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Lista de Serviços
                    </CardTitle>
                    <CardDescription>
                        Total de {services.length} serviços monitorados
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-12 bg-muted/40 animate-pulse rounded-lg" />
                            ))}
                        </div>
                    ) : services.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <Cpu className="h-12 w-12 text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground">Nenhum serviço encontrado</p>
                        </div>
                    ) : (
                        <div className="rounded-md border border-muted/20 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow>
                                        <TableHead>Serviço</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Versão</TableHead>
                                        <TableHead>Criado em</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {services.map((service) => (
                                        <TableRow key={service.id} className="hover:bg-muted/20">
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span>{service.name}</span>
                                                    <span className="text-[10px] text-muted-foreground font-mono">{service.id}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(service.status || 'stopped') as any}>
                                                    {(service.status || 'stopped').toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-mono text-xs">{service.version || 'N/A'}</span>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-xs">
                                                {new Date(service.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Configurações">
                                                        <Settings className="h-4 w-4" />
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem className="gap-2">
                                                                <Edit className="h-4 w-4" /> Editar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(service.id)}>
                                                                <Trash2 className="h-4 w-4" /> Remover
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </MainLayout>
    );
}
