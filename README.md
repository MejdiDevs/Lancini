> [!IMPORTANT]
> **⚠️ SECURITY NOTICE:** This repository intentionally includes `.env` files and API credentials. We recognize the security risks associated with publishing sensitive data. However, for the context of this hackathon, we have included these (using only **free-tier** services) to ensure judges and collaborators can run the application instantly without manual environment setup. 
> 
> **DO NOT** use this practice in production environments.

# 🚀 Lancini - Maghreb Talent Connect

Lancini is a high-end recruitment and career management platform designed to bridge the gap between talented students and leading enterprises. The platform features a sophisticated Job Approval Workflow, personalized dashboards for different roles, and a premium visual experience.

---

## 🎨 Visual Identity
Lancini embodies a **Modern & Premium** aesthetic:
- **Primary Color:** Vibrant Orange (`#EC6D0A`) symbolizing energy and career growth.
- **Design Philosophy:** Minimalist, card-based layouts with rich typography and smooth micro-animations.
- **Tone:** Professional yet accessible, focused on clarity and data-driven insights.

---

## 🖼️ Preview
<!-- Placeholder for an image - reference your internal screenshots here -->
![MTC Dashboard Overview](https://i.ibb.co/wFbrWV7r/Lancini-ENET-Com-Forum.png)

---

## 🛠️ Step-by-Step Setup Guide

Follow these steps to get the platform running locally.

### 1. Backend Setup
1. Open a terminal in the `backend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and add your MongoDB Cloud URL and JWT Secret:
   ```env
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal in the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the `frontend` directory and point it to your backend:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
4. Start the app:
   ```bash
   npm run dev
   ```

### 3. Accessing the Platform
Visit `http://localhost:3000` in your browser.

---

## 🔑 Test Credentials
Use the following accounts to test different roles and workflows:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `mejdchennoufi06@gmail.com` | `123456` |
| **Enterprise** | `hr@telnet.com` | `123456` |
| **Admin** | `admin@mtc.com` | `password123` |

*(Note: Admin has access to the Job Moderation Console and Student Data Management)*

---

## 🚀 Future Features
- AI-driven Job Matching.
- Direct Chat between Recruiters and Students.
- PDF Resume Generation.
