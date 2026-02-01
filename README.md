> [!IMPORTANT]
> **Security Notice:** This repository includes `.env` files and API credentials for hackathon evaluation purposes. These are free-tier services intended to provide an instant setup for judges. Do not use this practice in production environments.

# Lancini - Maghreb Talent Connect

Lancini is a recruitment and career management platform connecting students with enterprises. It features an administrative job approval workflow, role-based dashboards, and a modern interface.

## Visual Identity
- **Primary Color:** Orange (#EC6D0A)
- **Interface:** Minimalist card-based design with micro-animations.
- **Tone:** Professional and accessible.

## Preview
![Lancini Dashboard](https://i.ibb.co/wFbrWV7r/Lancini-ENET-Com-Forum.png)

## Setup Guide

### Backend
1. Go to the `backend` folder.
2. Run `npm install`.
3. Verify the `.env` file has the MongoDB URI and JWT Secret.
4. Run `npm run dev`.

### Frontend
1. Go to the `frontend` folder.
2. Run `npm install`.
3. Verify `.env.local` points to the backend API (`http://localhost:5000/api`).
4. Run `npm run dev`.

### Access
The application will be available at `http://localhost:3000`.

## Test Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| Student | mejdchennoufi06@gmail.com | 123456 |
| Enterprise | hr@telnet.com | 123456 |
| Admin | admin@mtc.com | password123 |

*Admin access includes job moderation and student data management.*

## Future Roadmap
- AI-based job matching.
- Direct messaging.
- PDF resume generation.
