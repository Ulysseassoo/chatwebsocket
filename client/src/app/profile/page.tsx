"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Upload, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useUserStore } from "@/store/useUserStore"
import { handleApiAuthError } from "@/utils/handleApiAuthError"

const availableColors = [
	{ name: "Bleu Néon", value: "#1EAEDB" },
	{ name: "Rose Néon", value: "#D946EF" },
	{ name: "Vert Néon", value: "#4ADE80" },
	{ name: "Violet Néon", value: "#8B5CF6" },
	{ name: "Jaune Néon", value: "#FCD34D" },
	{ name: "Orange Néon", value: "#F97316" },
	{ name: "Rouge Néon", value: "#EF4444" },
	{ name: "Turquoise Néon", value: "#06B6D4" },
	{ name: "Rose Vif", value: "#EC4899" },
	{ name: "Vert Émeraude", value: "#10B981" },
	{ name: "Bleu Électrique", value: "#3B82F6" },
	{ name: "Violet Profond", value: "#7C3AED" },
	{ name: "Cyan Néon", value: "#22D3EE" },
	{ name: "Rose Pâle", value: "#F472B6" },
	{ name: "Jaune Vif", value: "#FBBF24" }
]

const passwordSchema = z
	.object({
		currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
		newPassword: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
		confirmPassword: z.string()
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Les mots de passe ne correspondent pas",
		path: ["confirmPassword"]
	})

type PasswordFormData = z.infer<typeof passwordSchema>

const Profile = () => {
	const { toast } = useToast()
	const [showPassword, setShowPassword] = useState(false)
	const [selectedColor, setSelectedColor] = useState("#1EAEDB")
	const [loading, setLoading] = useState(false)
	const user = useUserStore((state) => state.user)
	const setUser = useUserStore((state) => state.setUser)
	const fetchUser = useUserStore((state) => state.fetchUser)

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm<PasswordFormData>({
		resolver: zodResolver(passwordSchema)
	})

	useEffect(() => {
		fetchUser()
	}, [])

	useEffect(() => {
		if (user?.color) {
			setSelectedColor(user.color)
		}
	}, [user?.color])

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file || !user) return

		setLoading(true)

		try {
			const formData = new FormData()
			formData.append("profilePhoto", file)

			const token = localStorage.getItem("token")
			const response = await fetch("/api/users/profile", {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`
				},
				body: formData
			})
			if (handleApiAuthError(response)) return

			if (!response.ok) throw new Error("Upload failed")

			const data = await response.json()

			const updatedUser = {
				...user,
				profilePhoto: data.profilePhoto
			}
			setUser(updatedUser)

			toast({
				title: "Photo de profil mise à jour",
				variant: "default"
			})
		} catch (err) {
			console.error("Upload error:", err)
			toast({
				title: "Erreur lors du téléchargement",
				variant: "destructive"
			})
		} finally {
			setLoading(false)
		}
	}

	const handleUpdateColor = async () => {
		if (!user) return

		try {
			const token = localStorage.getItem("token")
			const response = await fetch("/api/users/profile", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ color: selectedColor })
			})
			if (handleApiAuthError(response)) return

			if (!response.ok) throw new Error("Update failed")

			const data = await response.json()
			const updatedUser = {
				...user,
				color: data.color
			}
			setUser(updatedUser)

			toast({
				title: "Couleur de texte mise à jour",
				variant: "default"
			})
		} catch (err) {
			console.error("Color update error:", err)
			toast({
				title: "Erreur lors de la mise à jour",
				variant: "destructive"
			})
		}
	}

	const onSubmit = async (data: PasswordFormData) => {
		setLoading(true)

		try {
			const token = localStorage.getItem("token")
			const response = await fetch("/api/users/profile", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					currentPassword: data.currentPassword,
					newPassword: data.newPassword
				})
			})
			if (handleApiAuthError(response)) return

			if (!response.ok) throw new Error("Password update failed")

			reset()

			toast({
				title: "Mot de passe mis à jour avec succès",
				variant: "default"
			})
		} catch (err) {
			console.error("Password update error:", err)
			toast({
				title: "Erreur lors de la mise à jour du mot de passe",
				variant: "destructive"
			})
		} finally {
			setLoading(false)
		}
	}

	if (!user) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-gray-500">Loading...</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-dark flex flex-col">
			<header className="bg-dark-light border-b border-white/10 p-4">
				<div className="container mx-auto flex justify-between items-center">
					<div className="flex items-center">
						<Link href="/chat">
							<Button variant="ghost" size="icon" className="text-white mr-2 neon-button">
								<ArrowLeft className="h-5 w-5" />
							</Button>
						</Link>
						<h1 className="text-2xl font-bold font-cyberpunk text-white">
							<span className="text-neon-blue">Profil</span> Utilisateur
						</h1>
					</div>
				</div>
			</header>

			<div className="flex-1 container mx-auto py-8 px-4">
				<div className="max-w-2xl mx-auto">
					<div className="bg-dark-lighter p-6 rounded-lg shadow-lg mb-8 border border-white/10">
						<h2 className="text-xl font-semibold text-white mb-6">Photo de profil</h2>
						<div className="flex flex-col items-center md:flex-row md:items-start gap-6">
							<div className="relative">
								<div className="h-32 w-32 rounded-full border-4 border-neon-blue overflow-hidden">
									{user.profilePhoto ? (
										<img src={`http://localhost:4000${user.profilePhoto}`} alt={user.username} className="w-full h-full object-cover" />
									) : (
										<div className="w-full h-full bg-dark-light text-neon-blue text-3xl flex items-center justify-center">
											{user.username.charAt(0).toUpperCase()}
										</div>
									)}
								</div>
							</div>
							<div className="flex-1">
								<p className="text-muted-foreground mb-4">Téléchargez une nouvelle photo de profil. Image carrée recommandée, format PNG ou JPEG.</p>
								<div className="flex flex-col md:flex-row gap-4">
									<label
										htmlFor="avatar-upload"
										className="cursor-pointer flex items-center justify-center gap-2 bg-dark-light px-4 py-2 rounded-md border border-white/20 hover:bg-white/10 transition-colors duration-200 neon-button">
										<Upload className="h-4 w-4 text-white" />
										<span className="text-white">Choisir une image</span>
									</label>
									<Input type="file" id="avatar-upload" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={loading} />
								</div>
							</div>
						</div>
					</div>

					<div className="bg-dark-lighter p-6 rounded-lg shadow-lg mb-8 border border-white/10">
						<h2 className="text-xl font-semibold text-white mb-6">Couleur de texte</h2>
						<div className="space-y-4">
							<p className="text-muted-foreground">Choisissez la couleur qui sera utilisée pour votre nom et vos messages dans le chat.</p>
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
								{availableColors.map((color) => (
									<div
										key={color.value}
										className={`cursor-pointer flex flex-col items-center p-3 rounded-lg transition-all ${
											selectedColor === color.value ? "ring-2 ring-white" : ""
										}`}
										onClick={() => setSelectedColor(color.value)}>
										<div className="h-10 w-10 rounded-full mb-2" style={{ backgroundColor: color.value, boxShadow: `0 0 10px ${color.value}` }}></div>
										<span className="text-xs text-white text-center">{color.name}</span>
									</div>
								))}
							</div>
							<Button onClick={handleUpdateColor} className="w-full sm:w-auto neon-button" disabled={loading}>
								Enregistrer la couleur
							</Button>
						</div>
					</div>

					<div className="bg-dark-lighter p-6 rounded-lg shadow-lg border border-white/10">
						<h2 className="text-xl font-semibold text-white mb-6">Changer le mot de passe</h2>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div className="space-y-2">
								<label htmlFor="current-password" className="text-white block">
									Mot de passe actuel
								</label>
								<div className="relative">
									<Input
										id="current-password"
										type={showPassword ? "text" : "password"}
										className="neo-input animate-glow-blue pr-10"
										{...register("currentPassword")}
									/>
									<button
										type="button"
										className="absolute right-3 top-2 text-white/70 hover:text-white"
										onClick={() => setShowPassword(!showPassword)}>
										{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
									</button>
								</div>
								{errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>}
							</div>

							<div className="space-y-2">
								<label htmlFor="new-password" className="text-white block">
									Nouveau mot de passe
								</label>
								<Input
									id="new-password"
									type={showPassword ? "text" : "password"}
									className="neo-input animate-glow-pink"
									{...register("newPassword")}
								/>
								{errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
							</div>

							<div className="space-y-2">
								<label htmlFor="confirm-password" className="text-white block">
									Confirmer le nouveau mot de passe
								</label>
								<Input
									id="confirm-password"
									type={showPassword ? "text" : "password"}
									className="neo-input animate-glow-pink"
									{...register("confirmPassword")}
								/>
								{errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
							</div>

							<Button type="submit" className="w-full sm:w-auto neon-button" disabled={loading}>
								{loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
							</Button>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Profile
