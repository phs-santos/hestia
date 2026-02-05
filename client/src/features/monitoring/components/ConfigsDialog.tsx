import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { monitoringService, ServiceConfig } from '../api/monitoringService';
import { Loader2, Trash2, Plus, Save, X, Eye, EyeOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface ConfigsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    serviceId: string;
}

export function ConfigsDialog({ open, onOpenChange, serviceId }: ConfigsDialogProps) {
    const [configs, setConfigs] = useState<ServiceConfig[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newConfig, setNewConfig] = useState<{ key: string; value: string; isSecret: boolean } | null>(null);
    const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

    const loadConfigs = async () => {
        setLoading(true);
        try {
            const data = await monitoringService.getServiceConfigs(serviceId);
            setConfigs(data);
        } catch (error) {
            console.error('Failed to load configs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            loadConfigs();
            setNewConfig(null);
            setEditingId(null);
        }
    }, [open, serviceId]);

    const handleSaveNew = async () => {
        if (!newConfig) return;
        try {
            await monitoringService.createServiceConfig({
                serviceId,
                ...newConfig
            });
            setNewConfig(null);
            loadConfigs();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await monitoringService.deleteServiceConfig(id);
            loadConfigs();
        } catch (error) {
            console.error(error);
        }
    };

    const toggleSecret = (id: string) => {
        setShowSecrets(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Configurações do Serviço</DialogTitle>
                    <DialogDescription>
                        Gerencie as variáveis de ambiente e configurações deste serviço.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted">
                                        <tr className="text-left">
                                            <th className="p-3 font-medium">Chave</th>
                                            <th className="p-3 font-medium">Valor</th>
                                            <th className="p-3 font-medium w-20">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {configs.map((config) => (
                                            <tr key={config.id} className="bg-card">
                                                <td className="p-3 font-mono">{config.key}</td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono">
                                                            {config.isSecret && !showSecrets[config.id]
                                                                ? '••••••••'
                                                                : config.value}
                                                        </span>
                                                        {config.isSecret && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6"
                                                                onClick={() => toggleSecret(config.id)}
                                                            >
                                                                {showSecrets[config.id] ? (
                                                                    <EyeOff className="h-3 w-3" />
                                                                ) : (
                                                                    <Eye className="h-3 w-3" />
                                                                )}
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                                        onClick={() => handleDelete(config.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {configs.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="p-8 text-center text-muted-foreground">
                                                    Nenhuma configuração encontrada.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* New Config Form */}
                            {newConfig ? (
                                <div className="border rounded-lg p-4 bg-muted/50 space-y-3">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Chave</Label>
                                            <Input
                                                value={newConfig.key}
                                                onChange={e => setNewConfig({ ...newConfig, key: e.target.value })}
                                                placeholder="API_KEY"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Valor</Label>
                                            <Input
                                                value={newConfig.value}
                                                onChange={e => setNewConfig({ ...newConfig, value: e.target.value })}
                                                placeholder="secret_123"
                                                type={newConfig.isSecret ? "password" : "text"}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="secret-mode"
                                                checked={newConfig.isSecret}
                                                onCheckedChange={checked => setNewConfig({ ...newConfig, isSecret: checked })}
                                            />
                                            <Label htmlFor="secret-mode">É secreto?</Label>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => setNewConfig(null)}>
                                                Cancelar
                                            </Button>
                                            <Button size="sm" onClick={handleSaveNew} disabled={!newConfig.key || !newConfig.value}>
                                                Salvar
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="w-full border-dashed"
                                    onClick={() => setNewConfig({ key: '', value: '', isSecret: false })}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Adicionar Nova Configuração
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
