import React, { useState, useEffect } from 'react';
import Pusher from 'pusher-js';

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

const Notifications = () => {
    const [notifications] = useState<any[]>([]);

    return (
        <div>
            <h2>Notifications</h2>
            <ul>
                {notifications.map((notification: any) => (
                    <li key={notification.id}>{notification.message}</li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;