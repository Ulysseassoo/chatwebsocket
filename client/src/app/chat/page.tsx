"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatRoom from '@/components/chat/ChatRoom';
import { ChatProvider } from "@/hooks/ChatContext";

export default function ChatPage() {
	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			router.push('/login');
		}
	}, [router]);

	return (
		<ChatProvider>
			<ChatRoom />
		</ChatProvider>
	)
}
