import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Dashboard() {
	return (
		<MainLayout>
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
					<p className="text-sm text-muted-foreground">Visão geral da semana</p>
				</div>

				<div className="flex gap-2">
					<Button onClick={() => { }} className="gap-2">
						<Plus className="h-4 w-4" />
						Novo alguma coisa
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<div className="bg-background p-6 rounded-lg shadow-sm">
					<h2 className="text-lg font-semibold text-foreground mb-2">Card 1</h2>
					<p className="text-sm text-muted-foreground">Descrição do card 1</p>
				</div>

				<div className="bg-background p-6 rounded-lg shadow-sm">
					<h2 className="text-lg font-semibold text-foreground mb-2">Card 2</h2>
					<p className="text-sm text-muted-foreground">Descrição do card 2</p>
				</div>

				<div className="bg-background p-6 rounded-lg shadow-sm">
					<h2 className="text-lg font-semibold text-foreground mb-2">Card 3</h2>
					<p className="text-sm text-muted-foreground">Descrição do card 3</p>
				</div>
			</div>
		</MainLayout >
	);
}
