import * as z from 'zod'
import { useState } from 'react'
import { Navigate } from "react-router-dom";
import { useForm } from 'react-hook-form'
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from '@/contexts/AuthContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2, BarChart3, Users } from 'lucide-react'

const loginSchema = z.object({
	identifier: z.string().min(1, 'E-mail ou usuário é obrigatório'),
	password: z.string().min(1, 'Senha é obrigatória'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
	const { login, isAuthenticated } = useAuth()
	const [isLoading, setIsLoading] = useState(false)
	const [showPassword, setShowPassword] = useState(false)

	const loginForm = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: { identifier: '', password: '' }
	})

	if (isAuthenticated) {
		return <Navigate to={'/dashboard'} replace />;
	}

	const onLoginSubmit = async (data: LoginFormValues) => {
		setIsLoading(true)
		try {
			const result = await login(data.identifier, data.password)
			if (result.success) {
				toast.success('Bem-vindo de volta!')
			} else {
				toast.error(result.error || 'Credenciais inválidas')
			}
		} finally {
			setIsLoading(false)
		}
	}

	const features = [
		{ icon: BarChart3, title: 'Gestão Eficiente', desc: 'Controle total sobre seus processos e dados' },
		{ icon: Users, title: 'Colaboração', desc: 'Trabalhe em equipe de forma sincronizada' },
		{ icon: CheckCircle2, title: 'Confiabilidade', desc: 'Segurança e alta disponibilidade para seu negócio' },
	]

	return (
		<div className="min-h-screen w-full flex bg-background">
			<div className="absolute top-4 right-4 z-50">
				<ThemeToggle />
			</div>

			<div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/10 via-background to-primary/5 border-r border-border/50">
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
					<div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-border/20 rounded-full" />
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-border/30 rounded-full" />
				</div>

				<div className="relative z-10 flex flex-col justify-center px-16 py-12 w-full">
					<div className="mb-16">
						<div className="flex items-center gap-3 mb-4">
							<div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
								<span className="text-2xl font-black text-primary-foreground">H</span>
							</div>
							<div>
								<h1 className="text-4xl font-black tracking-tight text-foreground uppercase">HESTIA</h1>
								<p className="text-xs font-semibold tracking-widest text-primary uppercase">Plataforma de Gestão</p>
							</div>
						</div>
					</div>

					<div className="space-y-8">
						{features.map((feature, i) => (
							<div key={i} className="flex items-start gap-4 group">
								<div className="flex-shrink-0 w-12 h-12 rounded-xl bg-card border border-border/50 flex items-center justify-center shadow-sm group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300">
									<feature.icon className="w-5 h-5 text-primary" />
								</div>
								<div className="pt-1">
									<h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
									<p className="text-sm text-muted-foreground">{feature.desc}</p>
								</div>
							</div>
						))}
					</div>

					<div className="mt-auto pt-16">
						<div className="flex items-center gap-3 text-muted-foreground">
							<CheckCircle2 className="w-4 h-4 text-primary" />
							<span className="text-xs tracking-wide">Plataforma segura e confiável</span>
						</div>
					</div>
				</div>
			</div>

			<div className="flex-1 flex items-center justify-center p-6 lg:p-12">
				<div className="w-full max-w-md space-y-8 border border-border/50 rounded-xl p-8">
					<div className="lg:hidden text-center mb-8">
						<div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary mb-4">
							<span className="text-3xl font-black text-primary-foreground">H</span>
						</div>
						<h1 className="text-3xl font-black tracking-tight text-foreground uppercase">HESTIA</h1>
						<p className="text-xs font-semibold tracking-widest text-primary uppercase mt-1">Plataforma de Gestão</p>
					</div>

					<div className="text-center lg:text-left">
						<h2 className="text-2xl font-bold text-foreground mb-2">
							Bem-vindo de volta
						</h2>
						<p className="text-muted-foreground">
							Entre com suas credenciais para acessar o sistema
						</p>
					</div>

					<form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
						<div className="space-y-2">
							<Label htmlFor="identifier" className="text-sm font-medium">
								E-mail ou Usuário
							</Label>
							<div className="relative">
								<Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									id="identifier"
									{...loginForm.register('identifier')}
									placeholder="e-mail ou nickname"
									className="h-12 pl-10 bg-muted/30 border-border/50 focus:bg-background transition-colors"
								/>
							</div>
							{loginForm.formState.errors.identifier && (
								<p className="text-xs text-destructive font-medium">
									{loginForm.formState.errors.identifier.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="password" className="text-sm font-medium">
								Senha
							</Label>
							<div className="relative">
								<Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									id="password"
									{...loginForm.register('password')}
									type={showPassword ? 'text' : 'password'}
									placeholder="••••••••"
									className="h-12 pl-10 pr-10 bg-muted/30 border-border/50 focus:bg-background transition-colors"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(prev => !prev)}
									className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
									aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
								>
									{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
								</button>
							</div>
							{loginForm.formState.errors.password && (
								<p className="text-xs text-destructive font-medium">
									{loginForm.formState.errors.password.message}
								</p>
							)}
						</div>

						<Button
							type="submit"
							disabled={isLoading}
							className="w-full h-12 text-base font-semibold"
						>
							{isLoading ? (
								<Loader2 className="h-5 w-5 animate-spin" />
							) : (
								'Entrar'
							)}
						</Button>
					</form>

					<p className="text-center text-xs text-muted-foreground">
						Ao entrar, você concorda com nossos termos de uso
					</p>
				</div>
			</div>
		</div>
	)
}
