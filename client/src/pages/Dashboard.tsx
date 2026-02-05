import { MainLayout } from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Activity, AlertTriangle, ArrowRight, Layers, Plus, ServerIcon } from 'lucide-react';
import { CreateServerDialog } from '@/features/monitoring/components/CreateServerDialog';
import { Server } from '@/types/infrastructure';
import { useState, useEffect } from 'react';
import { mockActivities } from '@/data/mockData';
import { MetricCard } from '@/components/MetricCard';
import { monitoringService } from '@/features/monitoring/api/monitoringService';
import { ActivityFeed } from '@/components/ActivityFeed';
import { ServerCard } from '@/features/monitoring/components/ServerCard';
import { ServerDetailsSheet } from '@/components/ServerDetailsSheet';

export default function Dashboard() {
	const [servers, setServers] = useState<Server[]>([]);
	const [loading, setLoading] = useState(true);
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [selectedServer, setSelectedServer] = useState<Server | null>(null);
	const [detailsOpen, setDetailsOpen] = useState(false);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		try {
			setLoading(true);
			const data = await monitoringService.getServers();
			setServers(data);
		} catch (error) {
			console.error('Failed to load servers:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleCreateServer = async (newServer: Omit<Server, 'id' | 'services' | 'uptime' | 'cpu' | 'memory' | 'storage'>) => {
		try {
			await monitoringService.createServer(newServer);
			loadData();
		} catch (error) {
			console.error('Failed to create server:', error);
		}
	};

	const handleSelectServer = (server: Server) => {
		setSelectedServer(server);
		setDetailsOpen(true);
	};

	const runningServers = servers.filter(s => s.status === 'running').length;
	const totalServices = servers.reduce((acc, s) => acc + s.services.length, 0);
	const alertCount = servers.filter(s => s.status === 'error' || s.status === 'maintenance').length;

	return (
		<MainLayout>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
						<p className="text-muted-foreground mt-1">
							Visão geral da sua infraestrutura de desenvolvimento
						</p>
					</div>
					<Button onClick={() => setCreateDialogOpen(true)}>
						<Plus className="mr-2 h-4 w-4" />
						Novo Servidor
					</Button>
				</div>

				{/* Metrics */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<MetricCard
						title="Servidores Ativos"
						value={runningServers}
						subtitle={`de ${servers.length} total`}
						icon={ServerIcon}
						trend={{ value: 12, positive: true }}
					/>
					<MetricCard
						title="Total de Serviços"
						value={totalServices}
						subtitle="em execução"
						icon={Layers}
						trend={{ value: 8, positive: true }}
					/>
					<MetricCard
						title="Uptime Médio"
						value="99.7%"
						subtitle="últimos 30 dias"
						icon={Activity}
					/>
					<MetricCard
						title="Alertas"
						value={alertCount}
						subtitle="requerem atenção"
						icon={AlertTriangle}
						className={alertCount > 0 ? 'border-warning/30' : ''}
					/>
				</div>

				{/* Main Content */}
				<div className="grid gap-6 lg:grid-cols-3">
					{/* Servers */}
					<div className="lg:col-span-2 space-y-4">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-semibold">Servidores</h2>
							<Button variant="ghost" size="sm">
								Ver todos <ArrowRight className="ml-1 h-4 w-4" />
							</Button>
						</div>
						<div className="grid gap-4 md:grid-cols-2">
							{servers.slice(0, 4).map((server) => (
								<ServerCard
									key={server.id}
									server={server}
									onSelect={handleSelectServer}
								/>
							))}
						</div>
					</div>

					{/* Activity Feed */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-semibold">Atividade Recente</h2>
							<Button variant="ghost" size="sm">
								Ver todas <ArrowRight className="ml-1 h-4 w-4" />
							</Button>
						</div>
						<div className="rounded-xl border border-border bg-card p-4">
							<ActivityFeed activities={mockActivities} />
						</div>
					</div>
				</div>
			</div>

			<CreateServerDialog
				open={createDialogOpen}
				onOpenChange={setCreateDialogOpen}
				onCreateServer={handleCreateServer}
			/>

			<ServerDetailsSheet
				server={selectedServer}
				open={detailsOpen}
				onOpenChange={setDetailsOpen}
			/>
		</MainLayout >
	);
}
