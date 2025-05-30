"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useChatContext } from "@/hooks/ChatContext"
import { Message } from "@/types/chat"
import { useUserStore } from "@/store/useUserStore"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { User, LogOut, Send } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Socket } from "socket.io-client"

export default function ChatRoom() {
	const { messages, connected, error, sendMessage } = useChatContext()
	const [newMessage, setNewMessage] = useState("")
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const user = useUserStore((state) => state.user)
	const { toast } = useToast()
	const socketRef = useRef<Socket | null>(null)

	useEffect(() => {
		useUserStore.getState().fetchUser()
	}, [])

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
	}, [])

	useEffect(() => {
		scrollToBottom()
	}, [messages, scrollToBottom])

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault()
			if (newMessage.trim() && connected) {
				sendMessage(newMessage.trim())
				setNewMessage("")
			}
		},
		[newMessage, connected, sendMessage]
	)

	const handleLogout = () => {
		if (socketRef.current) {
			socketRef.current.disconnect()
		}
		localStorage.removeItem("token")
		toast({
			title: "Déconnexion réussie",
			variant: "default"
		})
		window.location.href = "/"
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-red-500">{error}</div>
			</div>
		)
	}

	if (!user) {
		return (
			<div className="flex items-center justify-center h-screen  bg-dark ">
				<div className="text-white">Loading...</div>
			</div>
		)
	}

	return (
		<div className="flex h-screen bg-dark overflow-hidden">
			<div className="flex-1 flex flex-col h-full">
				<div className="bg-dark-light border-b border-white/10 p-4 flex items-center justify-between">
					<div className="flex items-center">
						<h1 className="text-2xl font-bold font-cyberpunk text-white ml-2">
							<span className="text-neon-blue">Neon</span> Chat Global
						</h1>
					</div>
					<div className="flex items-center space-x-2">
						<Link href="/profile">
							<Button variant="ghost" size="icon" className="text-white hover:bg-white/10 neon-button">
								<User className="h-5 w-5" />
							</Button>
						</Link>
						<Button variant="ghost" size="icon" onClick={handleLogout} className="text-white hover:bg-white/10 neon-button">
							<LogOut className="h-5 w-5" />
						</Button>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto p-4 space-y-4">
					<div className="flex flex-col">
						{messages.map((message: Message, index: number) =>
							message.type === "system" ? (
								<div key={message.id} className="text-gray-400 italic text-sm py-1 text-center">
									{message.content}
								</div>
							) : (
								<div
									key={message.id}
									className={`animate-fade-in ${message.senderId === user.id ? "flex justify-end" : "flex justify-start"}`}
									style={{ animationDelay: `${index * 0.1}s` }}>
									{message.senderId !== user.id && (
										<div className="flex items-start space-x-2 mr-2">
											{message.sender.profilePhoto !== null ? (
												<Image
													src={`http://localhost:4000${message.sender.profilePhoto}`}
													alt={message.sender.username}
													className="h-8 w-8 rounded-full object-cover"
													width={32}
													height={32}
												/>
											) : (
												<div className="h-8 w-8 rounded-full bg-neon-blue flex items-center justify-center text-white font-semibold">
													{message.sender.username.charAt(0).toUpperCase()}
												</div>
											)}
										</div>
									)}
									<div className={`message-bubble ${message.senderId === user.id ? "message-bubble-outgoing" : "message-bubble-incoming"}`}>
										{message.senderId !== user.id && (
											<p className="text-xs mb-1 font-semibold" style={{ color: "#ffffff" }}>
												{message.sender.username}
											</p>
										)}
										<p style={{ color: message.sender.color }}>{message.content}</p>
										<p className="text-xs text-white/50 text-right mt-1">
											{new Date(message.createdAt).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit"
											})}
										</p>
									</div>
									{message.senderId === user.id && (
										<div className="flex items-start space-x-2 ml-2">
											{message.sender.profilePhoto !== null ? (
												<Image
													src={`http://localhost:4000${message.sender.profilePhoto}`}
													alt={message.sender.username}
													className="h-8 w-8 rounded-full object-cover"
													width={32}
													height={32}
												/>
											) : (
												<div className="h-8 w-8 rounded-full bg-neon-blue flex items-center justify-center text-white font-semibold">
													{user.username.charAt(0).toUpperCase()}
												</div>
											)}
										</div>
									)}
								</div>
							)
						)}
						<div ref={messagesEndRef} />
					</div>
				</div>

				<form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-dark-light">
					<div className="flex space-x-2">
						<div className="flex-1">
							<textarea
								value={newMessage}
								onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewMessage(e.target.value)}
								placeholder="Tapez votre message ici..."
								className="neo-input h-10 min-h-[40px] max-h-[120px] resize-none w-full p-2 bg-dark border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
								onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault()
										handleSubmit(e)
									}
								}}
								disabled={!connected}
							/>
						</div>
						<Button type="submit" className="neon-button h-10 w-10 p-0" disabled={!connected || !newMessage.trim()}>
							<Send className="h-5 w-5" />
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}
