import { pusher } from '@/src/utils/pusher';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        let socketId: string;
        let channel: string;

        const contentType = request.headers.get('content-type');

        if (contentType?.includes('application/x-www-form-urlencoded')) {
            const text = await request.text();
            const params = new URLSearchParams(text);
            socketId = params.get('socket_id') || '';
            channel = params.get('channel_name') || '';
        } else {
            const formData = await request.formData();
            socketId = formData.get('socket_id') as string;
            channel = formData.get('channel_name') as string;
        }

        // Ensure the channel name matches the user's private channel
        if (!channel.startsWith(`private-user.1`)) {
            return new NextResponse('Forbidden', { status: 403 });
        }

        const authResponse = (pusher as any).authorizeChannel(socketId, channel, {
            user_id: '1',
            user_info: {}
        });
        return NextResponse.json(authResponse);
    } catch (error) {
        console.error('Error in POST:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}