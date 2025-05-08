"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { LoginFormData } from "@/types/auth"
import { useUserStore } from "@/store/useUserStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare } from "lucide-react"
import Link from "next/link"

export default function LoginForm() {
	const router = useRouter()
	const [error, setError] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const setUser = useUserStore((state) => state.setUser)
	const [formData, setFormData] = useState<LoginFormData>({
		username: "",
		password: ""
	})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")
		setIsLoading(true)

		if (!formData.username.trim() || !formData.password.trim()) {
			setError("Veuillez remplir tous les champs")
			setIsLoading(false)
			return
		}

		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(formData)
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.message || "Login failed")
			}

			localStorage.setItem("token", data.access_token)
			setUser(data.user)

			router.push("/chat")
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred")
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
						<span className="text-neon-blue">Neon</span> Whisper
					</h1>
					<p className="text-muted-foreground mt-2">Connectez-vous pour accéder au chat global</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<label htmlFor="username" className="block text-sm font-medium text-white">
							Nom d&apos;utilisateur
						</label>
						<div className="relative">
							<Input
								id="username"
								type="text"
								value={formData.username}
								onChange={(e) => setFormData({ ...formData, username: e.target.value })}
								placeholder="Entrez votre nom d'utilisateur"
								className="neo-input animate-glow-blue"
								required
							/>
						</div>
					</div>

					<div className="space-y-2">
						<label htmlFor="password" className="block text-sm font-medium text-white">
							Mot de passe
						</label>
						<div className="relative">
							<Input
								id="password"
								type="password"
								value={formData.password}
								onChange={(e) => setFormData({ ...formData, password: e.target.value })}
								placeholder="Entrez votre mot de passe"
								className="neo-input animate-glow-pink"
								required
							/>
						</div>
					</div>

					{error && <div className="text-red-500 text-sm text-center">{error}</div>}

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
