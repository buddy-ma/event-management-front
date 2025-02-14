import { useEffect, useState } from 'react';
import pusher from '@/src/utils/pusher';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../_components/ui/dropdown-menu"
import { Bell } from 'lucide-react';
import { Button } from './ui/button';
import { useSession } from 'next-auth/react';
interface Notification {
    id: number;
    data: {
        event_id: number;
        event_title: string;
        user_id: number;
        user_name: string;
    };
    created_at: string;
    read_at: string | null;
}

export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();

    useEffect(() => {
        if (!session?.user?.id) return;

        // Subscribe to the private channel for the specific user
        const channel = pusher.subscribe(`private-user.${session.user.id}`);

        // Listen for new notifications
        channel.bind('notification', (data: Notification) => {
            setNotifications(prev => [data, ...prev]);
        });

        // Fetch existing notifications on component mount
        fetchNotifications();

        // Cleanup on unmount
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [session?.user?.id]); // Add session user id as dependency

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notifications`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${session?.user?.token}`
                }
            });

            if (!response.ok) {
                console.log(response);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setNotifications(Array.isArray(data) ? data : []);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to fetch notifications');
            console.error('Error fetching notifications:', error);
        }
    };

    return (
        <div className="max-w-xl">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className='relative bg-transparent border-none focus:border-none focus:ring-0 focus:outline-none active:border-none active:ring-0 active:outline-none rounded-full'>
                        <Bell />
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                                {notifications.filter(notification => !notification.read_at).length}
                            </span>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 max-h-80 overflow-y-auto no-scrollbar">
                    {error ? (
                        <DropdownMenuLabel className="text-red-500">
                            {error}
                        </DropdownMenuLabel>
                    ) : notifications.length === 0 ? (
                        <DropdownMenuLabel>
                            No notifications
                        </DropdownMenuLabel>
                    ) : (
                        notifications.map((notification) => (
                            <div key={notification.id}>
                                <DropdownMenuLabel className={`flex flex-col gap-1 cursor-pointer ${!notification.read_at ? 'bg-secondary/10 hover:bg-secondary/20' : 'hover:bg-secondary/10'}`}>

                                    <h2 className='flex justify-start items-center gap-2 text-left'>
                                        {!notification.read_at && (
                                            <span className="relative bg-secondary rounded-full w-2 h-2">
                                            </span>
                                        )}
                                        {JSON.parse(notification.data).event_title}
                                    </h2>
                                    <small className="text-gray-500">
                                        {new Date(notification.created_at).toLocaleString()}
                                    </small>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                            </div>
                        ))
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}