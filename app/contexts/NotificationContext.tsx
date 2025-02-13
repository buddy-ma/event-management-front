"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { pusherClient } from '@/src/utils/pusher';
import axios from 'axios';
import { useSession } from 'next-auth/react';


interface Notification {
    id: number;
    type: string;
    data: any;
    read_at: string | null;
    created_at: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: number) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { data: session } = useSession();
    const userId = session?.user?.id;

    useEffect(() => {
        if (!session?.user) return;
        if (!userId) return;

        // Configure Pusher to use your auth endpoint
        pusherClient.config.auth = {
            endpoint: '/api/pusher/auth',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${session?.user?.token}`
            }
        };

        // Fetch initial notifications
        fetchNotifications();

        // Subscribe to private channel
        const channel = pusherClient.subscribe(`private-user.1`);
        console.log("channel");
        console.log(channel);

        channel.bind('user.joined', (data: any) => {
            // Add new notification to the list
            setNotifications(prev => [{
                id: Date.now(),
                type: 'user_joined_event',
                data: data,
                read_at: null,
                created_at: new Date().toISOString(),
            }, ...prev]);

            console.log("New user joined");
            console.log(data);
            // toast.info(`New user joined: ${data.name || 'Someone'}`);

        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [userId, session?.user]);

    const fetchNotifications = async () => {
        if (!session?.user) return;
        if (userId) {
            console.log("Fetching notifications for user", userId);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notifications
                `, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${session?.user?.token}`
                }
            });
            console.log(response.data.data);
            setNotifications(response.data.data);
        }
    };

    const markAsRead = async (id: number) => {
        if (!session?.user) return;
        if (userId) {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notifications/${id}/read`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${session?.user?.token}`
                }
            });
            setNotifications(notifications.map(notif =>
                notif.id === id ? { ...notif, read_at: new Date().toISOString() } : notif
            ));
        }
    };

    const unreadCount = notifications.filter(n => !n.read_at).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};