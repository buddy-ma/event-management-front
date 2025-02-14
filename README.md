# Event Management System

Event Management System is a modern platform that enables users to create, manage, and participate in events seamlessly. The platform focuses on real-time interactions, intuitive event management, and keeping users informed through multiple communication channels.

## Features

### Event Management

- Create and manage events with essential details (date, location, max participants)
- View all events in a unified list (both hosted and attended)

### User Experience

- User-friendly interface for easy event navigation
- Waitlist management for full events

## Technical Stack

### Frontend

- React.js
- Next.js for SSR
- TailwindCSS for styling
- pusher.com for real-time notifications

### Backend

- Laravel

## Prerequisites

Before installing, ensure you have:

- Node.js (version 18.0.0 or higher)
- npm (version 8.0.0 or higher)
- MongoDB (version 5.0 or higher)
- Redis (version 6.0 or higher)

## Installation

1. Clone the repository

```bash
git clone https://github.com/buddy-ma/event-management-front.git
```

2. Navigate to the project directory

```bash
cd event-management-front
```

3. Install dependencies

```bash
npm install
```

4. Configure environment variables

```bash
cp .env.example .env
```

Add the following variables to your .env file:

```
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_PUSHER_APP_KEY=your_pusher_app_key
NEXT_PUBLIC_PUSHER_APP_CLUSTER=your_pusher_app_cluster
NEXT_PUBLIC_PUSHER_APP_ID=your_pusher_app_id
NEXT_PUBLIC_PUSHER_APP_SECRET=your_pusher_app_secret
```

5. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Documentation

### Events Endpoints

#### GET /api/events

- Returns a list of all events
- Supports pagination and filtering

#### POST /api/events

- Creates a new event
- Required fields: title, date, location, maxParticipants

#### GET /api/events/:id

- Returns details of a specific event

#### PUT /api/events/:id

- Updates an event
- Only accessible by event creator

#### POST /api/events/:id/join

- Joins an event
- Handles waitlist if event is full

### Users Endpoints

#### GET /api/users/me

- Returns current user's profile and events

#### GET /api/users/me/notifications

- Returns user's notifications

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact

Project Link: [https://github.com/buddy-ma/event-management-front.git](https://github.com/buddy-ma/event-management-front.git)
