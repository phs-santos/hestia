import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useFeatures } from '@/context/FeatureContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    Users, Shield, Settings, CheckCircle2, XCircle, Loader2,
    Plus, Trash2, Edit3, Activity, Zap, Cpu, HardDrive,
    RotateCcw, AlertTriangle, Monitor, Layout, LogOut
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { CockpitGauge } from '@/components/CockpitGauge';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminManagement() {
    const { user: currentUser, logout } = useAuth();
    const { features, refreshFeatures, isLoading: featuresLoading } = useFeatures();
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [isAddFeatureOpen, setIsAddFeatureOpen] = useState(false);

    // Form states
    const [newUser, setNewUser] = useState({ name: '', email: '', nickname: '', role: 'USER', password: '' });
    const [newFeature, setNewFeature] = useState({ code: '', name: '', path: '', description: '', enabled: true, allowedRoles: ['ROOT', 'ADMIN'] });

    const loadUsers = async () => {
        try {
            const response = await api.get('/users');
            if (response.data.data) setUsers(response.data.data);
        } catch (error) {
            console.error('Failed to load users:', error);
            toast.error('Erro ao conectar com o terminal de usuários');
        }
    };

    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            await loadUsers();
            setIsLoading(false);
        };
        init();
    }, []);

    const toggleFeature = async (code: string, enabled: boolean) => {
        try {
            setActionLoading(code);
            await api.patch(`/features/${code}`, { enabled });
            await refreshFeatures();
            toast.success(`Protocolo ${code} ${enabled ? 'HABILITADO' : 'DESABILITADO'}`);
        } catch (error) {
            toast.error('Falha na comunicação com o núcleo');
        } finally {
            setActionLoading(null);
        }
    };

    const deleteFeature = async (code: string) => {
        if (!confirm(`Confirmar DELEÇÃO permanente da funcionalidade ${code}?`)) return;
        try {
            setActionLoading(code);
            await api.delete(`/features/${code}`);
            await refreshFeatures();
            toast.success(`Módulo ${code} removido do sistema`);
        } catch (error) {
            toast.error('Operação abortada pelo sistema');
        } finally {
            setActionLoading(null);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await api.post('/users', newUser);
            await loadUsers();
            setIsAddUserOpen(false);
            setNewUser({ name: '', email: '', nickname: '', role: 'USER', password: '' });
            toast.success('Novo acesso autorizado no sistema');
        } catch (error) {
            toast.error('Erro ao autorizar novo usuário');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateFeature = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await api.post('/features', newFeature);
            await refreshFeatures();
            setIsAddFeatureOpen(false);
            setNewFeature({ code: '', name: '', path: '', description: '', enabled: true, allowedRoles: ['ROOT', 'ADMIN'] });
            toast.success('Novo módulo integrado com sucesso');
        } catch (error) {
            toast.error('Erro na integração do novo módulo');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading || featuresLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-950">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <span className="text-xs font-black tracking-[0.3em] text-primary animate-pulse uppercase">Inicializando Dashboard de Controle...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 space-y-8 font-mono relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0.7)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

            <header className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
                <div className="h-20 w-20 rounded-2xl bg-zinc-900 flex items-center justify-center border-2 border-primary/40 shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]">
                    <Monitor className="h-10 w-10 text-primary animate-pulse" />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <span className="text-xs font-black tracking-[0.2em] text-primary uppercase">Mainframe Online</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic">Cockpit Control</h1>
                    <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest mt-1">Acesso de Nível {currentUser?.role} - Núcleo de Comando Hestia</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block mr-2">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-tight">Estado da Sessão</p>
                        <p className="text-xs font-bold text-emerald-500 uppercase tracking-tighter">Conexão Segura</p>
                    </div>
                    <Button
                        onClick={logout}
                        variant="ghost"
                        className="group relative flex items-center gap-3 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-500 px-6 h-14 rounded-xl transition-all hover:scale-[1.05] active:scale-95"
                    >
                        <div className="flex flex-col items-end mr-1">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Sair do Console</span>
                            <span className="text-sm font-black uppercase tracking-tighter">Ejetar</span>
                        </div>
                        <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                            <LogOut className="h-5 w-5" />
                        </div>
                    </Button>
                </div>
            </header>

            <main className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Lateral Quick Actions */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="bg-zinc-900/60 border-white/10 backdrop-blur-2xl shadow-xl">
                        <CardHeader className="pb-4 border-b border-white/10">
                            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                <Zap className="h-4 w-4" /> Ações Rápidas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-3">
                            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full justify-start gap-3 bg-zinc-800 hover:bg-zinc-700 border-white/5 text-sm font-black uppercase tracking-wider h-14 transition-all hover:scale-[1.02]">
                                        <Plus className="h-5 w-5 text-primary" /> Recrutar Operador
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-zinc-900 border-white/10 text-zinc-100">
                                    <form onSubmit={handleCreateUser}>
                                        <DialogHeader>
                                            <DialogTitle className="uppercase italic font-black text-2xl tracking-tighter">Novo Operador</DialogTitle>
                                            <DialogDescription className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest">
                                                Autorização de acesso ao núcleo de comando.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-6">
                                            <div className="grid gap-2">
                                                <Label htmlFor="name" className="text-[10px] uppercase font-black text-zinc-500">Nome de Registro</Label>
                                                <Input id="name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="bg-zinc-950 border-white/10" required />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="email" className="text-[10px] uppercase font-black text-zinc-500">Endereço de E-mail</Label>
                                                <Input id="email" type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="bg-zinc-950 border-white/10" required />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="role" className="text-[10px] uppercase font-black text-zinc-500">Nível de Acesso</Label>
                                                <Select value={newUser.role} onValueChange={v => setNewUser({ ...newUser, role: v })}>
                                                    <SelectTrigger className="bg-zinc-950 border-white/10">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-zinc-900 border-white/10 text-zinc-100">
                                                        <SelectItem value="USER">USER - Nível 1</SelectItem>
                                                        <SelectItem value="ADMIN">ADMIN - Nível 2</SelectItem>
                                                        <SelectItem value="ROOT">ROOT - Nível 3</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="pass" className="text-[10px] uppercase font-black text-zinc-500">Chave de Segurança</Label>
                                                <Input id="pass" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} className="bg-zinc-950 border-white/10" placeholder="Hestia@2024" />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" className="w-full uppercase font-black tracking-widest shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">Registrar Operador</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={isAddFeatureOpen} onOpenChange={setIsAddFeatureOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full justify-start gap-3 bg-zinc-800 hover:bg-zinc-700 border-white/5 text-sm font-black uppercase tracking-wider h-14 transition-all hover:scale-[1.02]">
                                        <Layout className="h-5 w-5 text-primary" /> Instalar Módulo
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-zinc-900 border-white/10 text-zinc-100 max-w-2xl">
                                    <form onSubmit={handleCreateFeature}>
                                        <DialogHeader>
                                            <DialogTitle className="uppercase italic font-black text-2xl tracking-tighter">Instalação de Módulo</DialogTitle>
                                            <DialogDescription className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest">
                                                Injeção de nova funcionalidade no ecossistema central.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid grid-cols-2 gap-4 py-6">
                                            <div className="grid gap-2">
                                                <Label htmlFor="fcode" className="text-[10px] uppercase font-black text-zinc-500">ID do Módulo (Snake Case)</Label>
                                                <Input id="fcode" value={newFeature.code} onChange={e => setNewFeature({ ...newFeature, code: e.target.value })} className="bg-zinc-950 border-white/10" placeholder="analytics-core" required />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="fname" className="text-[10px] uppercase font-black text-zinc-500">Nome de Exibição</Label>
                                                <Input id="fname" value={newFeature.name} onChange={e => setNewFeature({ ...newFeature, name: e.target.value })} className="bg-zinc-950 border-white/10" required />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="fpath" className="text-[10px] uppercase font-black text-zinc-500">Rota do Terminal</Label>
                                                <Input id="fpath" value={newFeature.path} onChange={e => setNewFeature({ ...newFeature, path: e.target.value })} className="bg-zinc-950 border-white/10" placeholder="/analytics" required />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="fdesc" className="text-[10px] uppercase font-black text-zinc-500">Descrição Técnica</Label>
                                                <Input id="fdesc" value={newFeature.description} onChange={e => setNewFeature({ ...newFeature, description: e.target.value })} className="bg-zinc-950 border-white/10" />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" className="w-full uppercase font-black tracking-widest">Iniciar Deploy</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <Button onClick={() => window.location.reload()} variant="outline" className="w-full justify-start gap-3 border-white/10 hover:bg-white/5 text-sm font-black uppercase tracking-wider h-14">
                                <RotateCcw className="h-5 w-5" /> Resetar Console
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Status do Núcleo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-bold text-zinc-400">Mainframe</span>
                                <Badge className="bg-emerald-500/20 text-emerald-500 border-none text-[8px] font-black uppercase">Active</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-bold text-zinc-400">Logs DB</span>
                                <Badge className="bg-emerald-500/20 text-emerald-500 border-none text-[8px] font-black uppercase">Synched</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-bold text-zinc-400">Permissions</span>
                                <Badge className="bg-primary/20 text-primary border-none text-[8px] font-black uppercase">Root Mode</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Console Area */}
                <div className="lg:col-span-9">
                    <Tabs defaultValue="users" className="w-full">
                        <TabsList className="bg-zinc-900 border border-white/10 p-1.5 rounded-xl mb-8 flex lg:inline-flex shadow-inner">
                            <TabsTrigger value="users" className="flex-1 lg:flex-none gap-3 rounded-lg px-10 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm font-black uppercase tracking-widest transition-all">
                                <Users className="h-5 w-5" /> Gestão de Operadores
                            </TabsTrigger>
                            <TabsTrigger value="features" className="flex-1 lg:flex-none gap-3 rounded-lg px-10 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm font-black uppercase tracking-widest transition-all">
                                <Settings className="h-5 w-5" /> Malha de Módulos
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="users" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid gap-4">
                                {users.map((u) => (
                                    <Card key={u.id} className="bg-zinc-900/40 border-white/5 hover:border-primary/20 transition-all duration-300 group overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-800 group-hover:bg-primary transition-colors" />
                                        <CardContent className="p-6 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center text-primary font-black">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-xl uppercase tracking-tight">{u.name}</h3>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        <span className="text-xs text-zinc-500 font-bold">{u.email}</span>
                                                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
                                                        <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">ID: {u.id.substring(0, 8)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 block mb-1">Status de Acesso</span>
                                                    <Badge className={`border-none text-[9px] font-black uppercase px-3 ${u.role === 'ROOT' ? 'bg-red-500/10 text-red-500' :
                                                        u.role === 'ADMIN' ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'
                                                        }`}>
                                                        {u.role}
                                                    </Badge>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => toast.info('Acesso ao terminal remoto v1.4')}>
                                                        <Activity className="h-4 w-4" />
                                                    </Button>
                                                    {u.id !== currentUser?.id && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                                            onClick={() => toast.warning('Permissão negada pela diretriz de segurança Omega')}
                                                        >
                                                            <Shield className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="features" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {features.map((f) => (
                                    <Card key={f.id} className="bg-zinc-900/40 border-white/5 hover:border-primary/20 transition-all duration-300 relative overflow-hidden group">
                                        <CardHeader className="pb-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${f.enabled ? 'bg-primary/10 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                                                        < Zap className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-sm font-black uppercase tracking-wider">{f.name}</CardTitle>
                                                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{f.id}</span>
                                                    </div>
                                                </div>
                                                <Switch
                                                    checked={f.enabled}
                                                    onCheckedChange={(val) => toggleFeature(f.id, val)}
                                                    disabled={actionLoading === f.id}
                                                    className="data-[state=checked]:bg-emerald-500"
                                                />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <p className="text-[11px] text-zinc-400 border-l-2 border-primary/20 pl-3 leading-relaxed">
                                                {f.description || 'Nenhum relatório técnico disponível para este módulo.'}
                                            </p>

                                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                <div className="flex gap-1.5 text-[8px]">
                                                    {f.allowedRoles?.map(role => (
                                                        <span key={role} className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-black uppercase">
                                                            {role}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-sm hover:text-red-500" onClick={() => deleteFeature(f.id)}>
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            {/* Matrix overlay effect */}
            <div className="fixed bottom-0 right-0 p-4 pointer-events-none opacity-20">
                <pre className="text-[8px] leading-tight font-black text-primary">
                    [SYSTEM_MODE: ENHANCED]<br />
                    [KERNEL: 5.15.0-EST-ALPHA]<br />
                    [ACCESS_PATH: {currentUser?.nickname || 'UNKNOWN'}.sys]<br />
                    [ENCRYPTION: AES-256-HIGH]
                </pre>
            </div>
        </div>
    );
}
