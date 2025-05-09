"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useUserStore } from "@/store/useUserStore"

interface RegisterFormData {
	username: string
	password: string
	confirmPassword: string
}

export default function RegisterForm() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const { toast } = useToast()
	const setUser = useUserStore((state) => state.setUser)
	const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>({
		mode: "onBlur"
	})

	const password = watch("password")

	const onSubmit = async (data: RegisterFormData) => {
		setIsLoading(true)
		try {
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					username: data.username,
					password: data.password
				}),
				credentials: "include"
			})

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}))
				toast({
					variant: "destructive",
					title: "Erreur d'inscription",
					description: errorData.message || "Échec de l'inscription. Veuillez réessayer."
				})
				return
			}

			toast({
				title: "Inscription réussie",
				description: "Veuillez vous connecter pour accéder au chat.",
				className: "bg-dark border border-neon-pink text-white"
			})
			router.push("/login")
		} catch (err) {
			toast({
				variant: "destructive",
				title: "Erreur",
				description: "Une erreur est survenue lors de l'inscription."
			})
			console.error("Registration error:", err)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-dark p-4">
			<div className="w-full max-w-md">
				<div className="flex flex-col items-center mb-8">
					<div className="h-20 w-20 rounded-full bg-dark-lighter flex items-center justify-center mb-4 neon-border neon-border-pink">
						<MessageSquare className="h-12 w-12 text-neon-pink animate-pulse-opacity" />
					</div>
					<h1 className="text-4xl font-bold font-cyberpunk tracking-wider text-white">
						<span className="text-neon-pink">Créer</span> un compte
					</h1>
					<p className="text-muted-foreground mt-2">Inscrivez-vous pour accéder au chat global</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-2">
						<label htmlFor="username" className="block text-sm font-medium text-white">
							Nom d&apos;utilisateur
						</label>
						<div className="relative">
							<Input
								{...register("username", {
									required: "Le nom d'utilisateur est requis",
									minLength: {
										value: 5,
										message: "Le nom d'utilisateur doit contenir au moins 5 caractères"
									}
								})}
								id="username"
								type="text"
								placeholder="Entrez votre nom d'utilisateur"
								className="neo-input animate-glow-pink"
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
									required: "Le mot de passe est requis",
									minLength: {
										value: 6,
										message: "Le mot de passe doit contenir au moins 6 caractères"
									}
								})}
								id="password"
								type="password"
								placeholder="Entrez votre mot de passe"
								className="neo-input animate-glow-pink"
							/>
							{errors.password && (
								<p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
							Confirmer le mot de passe
						</label>
						<div className="relative">
							<Input
								{...register("confirmPassword", {
									required: "La confirmation du mot de passe est requise",
									validate: value => value === password || "Les mots de passe ne correspondent pas"
								})}
								id="confirmPassword"
								type="password"
								placeholder="Confirmez votre mot de passe"
								className="neo-input animate-glow-pink"
							/>
							{errors.confirmPassword && (
								<p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
							)}
						</div>
					</div>

					<Button
						type="submit"
						className="w-full neon-button"
						disabled={isLoading}
					>
						{isLoading ? "Inscription..." : "S'inscrire"}
					</Button>
				</form>

				<div className="mt-6 text-center">
					<p className="text-sm text-muted-foreground">
						Déjà un compte?{" "}
						<Link href="/login" className="text-neon-blue hover:underline">
							Se connecter
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
} 