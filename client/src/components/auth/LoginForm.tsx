"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { LoginFormData } from "@/types/auth"
import { useUserStore } from "@/store/useUserStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function LoginForm() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const { toast } = useToast()
	const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
		mode: "onBlur"
	})
	const setUser = useUserStore((state) => state.setUser)

	const onSubmit = async (data: LoginFormData) => {
		setIsLoading(true)
		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(data),
				credentials: "include"
			})

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}))
				toast({
					variant: "destructive",
					title: "Erreur de connexion",
					description: errorData.message || "Échec de la connexion. Veuillez réessayer."
				})
				return
			}

			const result = await response.json()
			toast({
				title: "Connexion réussie",
				description: "Vous allez être redirigé vers le chat.",
				className: "bg-dark border border-neon-blue text-white"
			})
			localStorage.setItem("token", result.access_token)
			setUser(result.user)
			router.push("/chat")
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Erreur",
				description: "Une erreur est survenue. Veuillez réessayer."
			})
			console.error("Login error:", error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-dark p-4">
			<div className="w-full max-w-md">
				<div className="flex flex-col items-center mb-8">
					<div className="h-20 w-20 rounded-full bg-dark-lighter flex items-center justify-center mb-4 neon-border neon-border-blue">
						<MessageSquare className="h-12 w-12 text-neon-blue animate-pulse-opacity" />
					</div>
					<h1 className="text-4xl font-bold font-cyberpunk tracking-wider text-white">
						<span className="text-neon-blue">Neon</span> Chat
					</h1>
					<p className="text-muted-foreground mt-2">Connectez-vous pour accéder au chat global</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-2">
						<label htmlFor="username" className="block text-sm font-medium text-white">
							Nom d&apos;utilisateur
						</label>
						<div className="relative">
							<Input
								{...register("username", {
									required: "Username is required",
									minLength: {
										value: 5,
										message: "Username must be at least 5 characters"
									}
								})}
								type="text"
								id="username"
								placeholder="Entrez votre nom d'utilisateur"
								className="neo-input animate-glow-blue"
							/>
							{errors.username && (
								<p className="mt-1 text-sm text-red-400">{errors.username.message}</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<label htmlFor="password" className="block text-sm font-medium text-white">
							Mot de passe
						</label>
						<div className="relative">
							<Input
								{...register("password", {
									required: "Password is required",
									minLength: {
										value: 6,
										message: "Password must be at least 6 characters"
									}
								})}
								type="password"
								id="password"
								placeholder="Entrez votre mot de passe"
								className="neo-input animate-glow-pink"
							/>
							{errors.password && (
								<p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
							)}
						</div>
					</div>

					<Button type="submit" className="w-full neon-button" disabled={isLoading}>
						{isLoading ? "Connexion..." : "Se connecter"}
					</Button>
				</form>

				<div className="mt-6 text-center">
					<p className="text-sm text-muted-foreground">
						Pas encore de compte?{" "}
						<Link href="/register" className="text-neon-pink hover:underline">
							S&apos;inscrire
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
