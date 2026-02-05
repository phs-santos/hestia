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
import { Server } from '@/types/infrastructure';
import { Loader2 } from 'lucide-react';

interface CreateServerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreateServer: (server: Omit<Server, 'id' | 'services' | 'uptime' | 'cpu' | 'memory' | 'storage'>) => void;
}

const regions = [
    { value: 'us-east-1', label: 'US East (N. Virginia)' },
    { value: 'us-west-2', label: 'US West (Oregon)' },
    { value: 'eu-central-1', label: 'EU (Frankfurt)' },
    { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
    { value: 'sa-east-1', label: 'South America (São Paulo)' },
];

export function CreateServerDialog({ open, onOpenChange, onCreateServer }: CreateServerDialogProps) {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [region, setRegion] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        onCreateServer({
            name,
            status: 'running',
            ip: `192.168.1.${Math.floor(Math.random() * 100) + 100}`,
            region,
            createdAt: new Date(),
        });

        setLoading(false);
        setName('');
        setRegion('');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Criar Novo Servidor</DialogTitle>
                    <DialogDescription>
                        Configure as opções do seu novo servidor de infraestrutura.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Servidor</Label>
                            <Input
                                id="name"
                                placeholder="ex: production-api-01"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="font-mono"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="region">Região</Label>
                            <Select value={region} onValueChange={setRegion} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma região" />
                                </SelectTrigger>
                                <SelectContent>
                                    {regions.map((r) => (
                                        <SelectItem key={r.value} value={r.value}>
                                            {r.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading || !name || !region}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? 'Criando...' : 'Criar Servidor'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
