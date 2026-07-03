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
PORT=5000

MONGODB_URI=mongodb://127.0.0.1:27017/meeting-room-booking

JWT_SECRET=b39f2e5ceeda35ab8af960444a1b776ddc4d18a86afb3fae46f8af2ccf994c183e55919d69251539d6335d48d2039b5ce75e71f4580f8638656500a0932fdc0b

JWT_EXPIRES_IN=7d

CLIENT_ORIGIN=http://localhost:5173
```

Frontend

```
VITE_API_URL=http://localhost:5000/api
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
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/29c322c0-1be9-4362-a0af-3b0529674ddc" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/7b76645e-0b7e-4475-a86d-9115c1696488" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/b592143f-900a-4c15-b60b-0a38313fd655" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/ed726003-787f-4d88-83db-64ed5c4c3be7" /><img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/814091ab-65d8-401d-823b-06cd42939f6b" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/f8430933-74d2-4079-882b-d9a705dbc788" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/e2d42dcd-e93b-41d1-b812-7c7b9cad566f" />


<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/d16e1ff6-664e-4463-85d1-036c8f66ee7c" />
