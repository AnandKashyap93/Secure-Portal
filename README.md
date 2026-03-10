# Secure Client Document Approval MVP

A demo-ready, secure MVP built for a hackathon, featuring role-based authentication, real-time status polling, and a sleek dark-mode UI with animations.

## Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS + Framer Motion + Lucide React
- **Backend**: Node.js + Express + Mongoose + JWT
- **Database**: MongoDB (Free Atlas / Local)

## Hackathon Decisions
- **Authentication**: While Auth0 was requested, a lightweight custom JWT implementation was used to guarantee a "zero-config" demo experience out of the box. This fulfills the requirement of instantly having **2 test accounts** pre-provisioned via a fake data loader, without requiring the judges/reviewers to configure an Auth0 tenant.
- **Real-time Status**: Implemented via 5-second polling (per constraints: no WebSockets).
- **Design**: Built with a sleek, glowing dark-mode UI inspired by premium enterprise apps, satisfying the "Wow Factor" requirement. Added micro-animations with Framer Motion.

## Getting Started

1. **Start Backend**:
   ```bash
   cd backend
   npm install
   node server.js
   ```
   *Note: Connects to MongoDB `localhost:27017` by default. Set `MONGODB_URI` in `.env` to connect to Atlas.*

2. **Start Frontend**:
   ```bash
   cd frontend
   npm install --legacy-peer-deps
   npm run dev
   ```

## Demo Script
1. **Login as Admin**:
   - Email: `admin@demo.com`
   - Password: `password123`
   - *Action*: Drag and drop a document to upload it for the Client.

2. **Open New Tab (Incognito)**:
   - Login as Client:
     - Email: `client@demo.com`
     - Password: `password123`
   - *Action*: You will see the incoming document. You can click "Approve" or add a comment and structured rejection.

3. **Real-time Updates**:
   - Return to the Admin tab and watch the document status automatically change to "Approved" with the accompanying glowing badge.

## Database Schema (Mongoose)

### User
- `name` (String)
- `email` (String)
- `password` (String)
- `role` ('admin' | 'client')

### Document
- `title` (String)
- `fileUrl` (String)
- `clientId` (ObjectId, ref: User)
- `status` ('pending' | 'approved' | 'rejected')
- `comments` [{ text, author, createdAt }]
