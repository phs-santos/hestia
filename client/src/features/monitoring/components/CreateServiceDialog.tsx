import { useState } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Service } from '@/types/infrastructure';
import { Loader2 } from 'lucide-react';

interface CreateServiceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreateService: (service: Partial<Service>) => Promise<void>;
    serverId: string;
}

const serviceTypes = [
    { value: 'api', label: 'API Server' },
    { value: 'database', label: 'Database' },
    { value: 'web', label: 'Web Application' },
    { value: 'cache', label: 'Cache (Redis/Memcached)' },
    { value: 'queue', label: 'Message Queue' },
    { value: 'storage', label: 'Object Storage' },
];

export function CreateServiceDialog({ open, onOpenChange, onCreateService, serverId }: CreateServiceDialogProps) {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [type, setType] = useState<any>('');
    const [version, setVersion] = useState('');
    const [port, setPort] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onCreateService({
                serverId,
                name,
                type,
                version,
                port: parseInt(port),
                status: 'pending',
            });
            setName('');
            setType('');
            setVersion('');
            setPort('');
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adicionar Novo Serviço</DialogTitle>
                    <DialogDescription>
                        Configure o novo serviço para este servidor.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Serviço</Label>
                            <Input
                                id="name"
                                placeholder="ex: Main API"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Tipo</Label>
                            <Select value={type} onValueChange={setType} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {serviceTypes.map((t) => (
                                        <SelectItem key={t.value} value={t.value}>
                                            {t.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="version">Versão</Label>
                                <Input
                                    id="version"
                                    placeholder="ex: 1.0.0"
                                    value={version}
                                    onChange={(e) => setVersion(e.target.value)}
                                    className="font-mono"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="port">Porta</Label>
                                <Input
                                    id="port"
                                    placeholder="ex: 3000"
                                    value={port}
                                    onChange={(e) => setPort(e.target.value)}
                                    type="number"
                                    className="font-mono"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading || !name || !type || !port}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? 'Adicionando...' : 'Adicionar Serviço'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
