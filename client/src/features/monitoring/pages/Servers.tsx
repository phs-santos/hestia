import { MainLayout } from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Activity, AlertTriangle, ArrowRight, Filter, Layers, Plus, Search, ServerIcon } from 'lucide-react';
import { CreateServerDialog } from '../components/CreateServerDialog';
import { ServerDetailsSheet } from '@/components/ServerDetailsSheet';
import { Server } from '@/types/infrastructure';
import { useState } from 'react';
import { mockActivities, mockServers } from '@/data/mockData';
import { MetricCard } from '@/components/MetricCard';
import { ServerCard } from '../components/ServerCard';
import { ActivityFeed } from '@/components/ActivityFeed';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Servers() {
	const navigate = useNavigate();
	const [servers, setServers] = useState(mockServers);
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');

	const handleCreateServer = (newServer: Omit<Server, 'id' | 'services' | 'uptime' | 'cpu' | 'memory' | 'storage'>) => {
		const server: Server = {
			...newServer,
			id: String(servers.length + 1),
			services: [],
			uptime: '0d 0h 0m',
			cpu: Math.floor(Math.random() * 30),
			memory: Math.floor(Math.random() * 40),
			storage: Math.floor(Math.random() * 20),
		};
		setServers([server, ...servers]);
	};

	const handleSelectServer = (server: Server) => {
		navigate(`/servers/${server.id}`);
	};

	const filteredServers = servers.filter((server) => {
		const matchesSearch = server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			server.ip.includes(searchQuery) ||
			server.region.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = statusFilter === 'all' || server.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	return (
		<MainLayout>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Servidores</h1>
						<p className="text-muted-foreground mt-1">
							Gerencie todos os seus servidores de infraestrutura
						</p>
					</div>
					<Button onClick={() => setCreateDialogOpen(true)}>
						<Plus className="mr-2 h-4 w-4" />
						Novo Servidor
					</Button>
				</div>

				{/* Filters */}
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Buscar por nome, IP ou região..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9"
						/>
					</div>
					<div className="flex items-center gap-2">
						<Filter className="h-4 w-4 text-muted-foreground" />
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-40">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Todos</SelectItem>
								<SelectItem value="running">Running</SelectItem>
								<SelectItem value="stopped">Stopped</SelectItem>
								<SelectItem value="maintenance">Maintenance</SelectItem>
								<SelectItem value="error">Error</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Server Grid */}
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{filteredServers.map((server) => (
						<ServerCard
							key={server.id}
							server={server}
							onSelect={handleSelectServer}
						/>
					))}
				</div>

				{filteredServers.length === 0 && (
					<div className="text-center py-12">
						<p className="text-muted-foreground">Nenhum servidor encontrado</p>
					</div>
				)}
			</div>

			<CreateServerDialog
				open={createDialogOpen}
				onOpenChange={setCreateDialogOpen}
				onCreateServer={handleCreateServer}
			/>
		</MainLayout >
	);
}
