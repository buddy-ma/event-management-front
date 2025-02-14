import pusher from '@/src/utils/pusher';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AuthOptions } from 'next-auth';
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions as AuthOptions);

        console.log("session");
        console.log(session);
        // Check for user ID in the correct location of the session object
        if (!session?.user?.id) {
            return new NextResponse('Unauthorized - Session not available', { status: 401 });
        }

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

        // Update the channel check to use session.user.id
        if (!channel.startsWith(`private-user.${session.user.id}`)) {
            return new NextResponse('Forbidden', { status: 403 });
        }

        const authResponse = pusher.authorizeChannel(socketId, channel, {
            user_id: session.user.id,
            user_info: {
                name: session.user.name,
                email: session.user.email
            }
        });

        return NextResponse.json(authResponse);
    } catch (error) {
        console.error('Error in POST:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}