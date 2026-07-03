# Real-Time Meeting Room Booking System

A full-stack Meeting Room Booking System built using the MERN Stack with JWT Authentication, Role-Based Access Control, Multi-Tenancy, and Real-Time Updates using Socket.IO.

---

# Features

## Authentication

- User Signup
- User Login
- User Logout
- JWT Authentication
- Protected Routes

---

## Multi-Tenancy

- Create Company Workspace
- Join Existing Company using Invite Code
- Company Data Isolation
- Separate Users
- Separate Meeting Rooms
- Separate Bookings

---

## Authorization

### Admin

- Create Meeting Rooms
- Update Meeting Rooms
- Delete Meeting Rooms
- Enable/Disable Meeting Rooms
- Invite Members
- View All Bookings

### Member

- View Available Rooms
- Book Meeting Rooms
- Cancel Own Booking
- View Own Bookings

---

## Meeting Room Management

Each Meeting Room contains

- Room Name
- Capacity
- Location
- Availability Status
- Created By

---

## Booking Management

Each Booking contains

- Meeting Room
- Booked By
- Date
- Start Time
- End Time
- Purpose
- Status

Rules Implemented

- No Double Booking
- No Overlapping Time Slots
- Members Cannot Cancel Others' Bookings
- Admin Can Cancel Any Booking
- Past Bookings Cannot Be Modified

---

## Real-Time Features

Implemented using Socket.IO

Events

- room:create
- room:update
- room:delete
- booking:create
- booking:update
- booking:cancel
- user:online
- user:offline

---

## Dashboard

Displays

- Total Rooms
- Available Rooms
- Total Bookings
- Today's Meetings
- Today's Booking Table

---

## Pages

Authentication

- Login
- Signup
- Join Company

Application

- Dashboard
- Meeting Rooms
- Book Room
- My Bookings
- Members
- Profile

---

# Tech Stack

## Frontend

- React
- React Router
- Axios
- Tailwind CSS
- Socket.IO Client

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Socket.IO
- bcrypt

---

# Folder Structure

```
client/
backend/
```

---

# Installation

## Backend

```
cd backend
npm install
npm run dev
```

## Frontend

```
cd client
npm install
npm run dev
```

---

# Environment Variables

Backend

```
PORT=
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
CLIENT_ORIGIN=
```

Frontend

```
VITE_API_URL=
```

---

# API Modules

Authentication

- Login
- Signup
- Current User

Company

- Members
- Invite Member

Rooms

- Create Room
- Update Room
- Delete Room
- Get Rooms

Bookings

- Create Booking
- Cancel Booking
- Get Bookings

---

# Bonus Features Implemented

- Dashboard with Today's Meetings
- Booking History
- Search Ready Architecture
- Responsive UI
- Professional Dashboard Cards
- Live Socket Updates

---

# Author

Deepika Narwani

B.Tech Computer Science Engineering
