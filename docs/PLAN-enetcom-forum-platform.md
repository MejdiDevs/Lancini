# PLAN: ENET'Com Annual Forum Platform

> **Project**: Full-stack internship platform for ENET'Com engineering school
> **Stack**: Next.js (frontend) + Node/Express (backend) + MongoDB + FastAPI AI services
> **Created**: 2026-01-31
> **Status**: Planning Phase

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture](#2-architecture)
3. [Route Map](#3-route-map)
4. [API Map](#4-api-map)
5. [MongoDB Schema](#5-mongodb-schema)
6. [Workflow UX](#6-workflow-ux)
7. [UI Design System](#7-ui-design-system)
8. [BackendRef Integration](#8-backendref-integration)
9. [Dev Setup](#9-dev-setup)
10. [Risks & Mitigations](#10-risks--mitigations)
11. [Milestones](#11-milestones)

---

## 1. Executive Summary

### What We're Building

A web platform connecting ENET'Com engineering students with enterprises for internship opportunities. Core features:

- **Students**: Build CVs, get ATS scores, apply to jobs, practice AI interviews, showcase projects
- **Enterprises**: Post listings, browse candidates, message students, send offers
- **Admins**: Manage users, moderate content, curate forum history

### Key Decisions

| Decision | Choice |
|----------|--------|
| Student emails | `@gmail.com` only |
| Enterprise access | Admin-approved or invite-only |
| Language | English first, i18n-ready for French |
| File storage | Local dev + S3/R2 abstraction |
| Real-time | Socket.io |
| Deployment | Vercel (Next.js) + Render/Railway (Node+FastAPI) |

---

## 2. Architecture

### 2.1 Monorepo Structure

```
enetcom-forum/
├── frontend/                 # Next.js 14+ App Router
│   ├── app/
│   │   ├── (public)/        # Landing, editions, auth
│   │   ├── (dashboard)/     # Protected dashboard routes
│   │   └── api/             # Next.js API routes (BFF pattern)
│   ├── components/
│   ├── lib/
│   └── public/
├── backend/                  # Node.js + Express
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   └── uploads/             # Local file storage (dev)
├── backendRef/              # Existing FastAPI (unchanged)
├── docs/
└── shared/                  # Shared types/schemas (optional)
```

### 2.2 Service Communication

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│  Node/Express    │────▶│  FastAPI (AI)   │
│   (Frontend)    │     │  (Main Backend)  │     │  (backendRef)   │
│   Port: 3000    │     │  Port: 5000      │     │  Port: 8000     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                       │
        │                       ▼
        │               ┌──────────────────┐
        │               │    MongoDB       │
        │               │  (Atlas / Local) │
        └──────────────▶└──────────────────┘
                     (SSR data fetching)
```

### 2.3 Auth Strategy

- **Method**: JWT in HTTP-only cookies
- **Flow**: Login → Node issues JWT + refresh token → stored in secure cookies
- **RBAC**: Roles stored in JWT payload (`STUDENT`, `ENTERPRISE`, `ADMIN`)
- **AI Service Auth**: Node → FastAPI uses internal API key header (no user tokens)

---

## 3. Route Map

### 3.1 Public Pages

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Landing page | Public |
| `/editions` | Forum history by year | Public |
| `/editions/[year]` | Year detail + charte + gallery | Public |
| `/auth/login` | Login form | Public |
| `/auth/register` | Role selection → signup wizard | Public |
| `/auth/register/student` | Student signup (multi-step) | Public |
| `/auth/register/enterprise` | Enterprise signup (pending approval) | Public |
| `/auth/verify-email` | Email verification | Public |
| `/auth/forgot-password` | Password reset request | Public |
| `/auth/reset-password` | Password reset form | Public |

### 3.2 Student Dashboard

| Route | Description |
|-------|-------------|
| `/dashboard` | Overview + quick stats |
| `/dashboard/cv` | CV Designer (templates, sections, preview) |
| `/dashboard/cv/score` | ATS Score + suggestions |
| `/dashboard/jobs` | Job listings (search, filter) |
| `/dashboard/jobs/[id]` | Job detail + apply + AI interview button |
| `/dashboard/jobs/[id]/interview` | AI Interview session |
| `/dashboard/applications` | My applications |
| `/dashboard/messages` | Conversations with enterprises |
| `/dashboard/messages/[id]` | Chat thread |
| `/dashboard/profile` | My public profile |
| `/dashboard/profile/edit` | Edit profile |
| `/dashboard/projects` | My projects list |
| `/dashboard/projects/new` | Add project |
| `/dashboard/projects/[id]` | Project detail |
| `/dashboard/settings` | Account settings |

### 3.3 Enterprise Dashboard

| Route | Description |
|-------|-------------|
| `/dashboard` | Overview + stats |
| `/dashboard/listings` | My job listings |
| `/dashboard/listings/new` | Create listing |
| `/dashboard/listings/[id]` | Edit/manage listing |
| `/dashboard/candidates` | Browse students (still looking) |
| `/dashboard/candidates/[id]` | View student profile |
| `/dashboard/messages` | Conversations |
| `/dashboard/messages/[id]` | Chat thread + send offer |
| `/dashboard/settings` | Company profile + settings |

### 3.4 Admin Dashboard

| Route | Description |
|-------|-------------|
| `/admin` | Admin overview |
| `/admin/users` | User management |
| `/admin/users/[id]` | User detail + role management |
| `/admin/enterprises/pending` | Pending enterprise approvals |
| `/admin/listings` | Moderate job listings |
| `/admin/editions` | Manage forum editions |
| `/admin/editions/new` | Add edition |
| `/admin/editions/[year]` | Edit edition |
| `/admin/analytics` | Basic analytics |
| `/admin/audit-logs` | Audit log viewer |

### 3.5 Public Profiles

| Route | Description |
|-------|-------------|
| `/students/[username]` | Public student profile |
| `/students/[username]/projects/[id]` | Public project page |
| `/companies/[slug]` | Public company profile |

---

## 4. API Map

### 4.1 Auth Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register/student` | Student signup | Public |
| POST | `/api/auth/register/enterprise` | Enterprise signup (pending) | Public |
| POST | `/api/auth/login` | Login | Public |
| POST | `/api/auth/logout` | Logout | Any |
| POST | `/api/auth/refresh` | Refresh token | Any |
| POST | `/api/auth/verify-email` | Verify email token | Public |
| POST | `/api/auth/forgot-password` | Request reset | Public |
| POST | `/api/auth/reset-password` | Reset password | Public |
| GET | `/api/auth/me` | Current user | Any |

### 4.2 Student Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/students/profile` | Get my profile | Student |
| PUT | `/api/students/profile` | Update profile | Student |
| POST | `/api/students/profile/avatar` | Upload avatar | Student |
| POST | `/api/students/profile/banner` | Upload banner | Student |

### 4.3 CV Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/cv` | Get my CV data | Student |
| PUT | `/api/cv` | Save CV data | Student |
| GET | `/api/cv/templates` | List templates | Student |
| POST | `/api/cv/export-pdf` | Export CV to PDF | Student |
| POST | `/api/cv/score` | Get ATS score (proxy to FastAPI) | Student |
| POST | `/api/cv/upload` | Upload existing PDF | Student |

### 4.4 Project Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/projects` | List my projects | Student |
| POST | `/api/projects` | Create project | Student |
| GET | `/api/projects/:id` | Get project | Any |
| PUT | `/api/projects/:id` | Update project | Student (owner) |
| DELETE | `/api/projects/:id` | Delete project | Student (owner) |
| POST | `/api/projects/:id/images` | Upload images | Student (owner) |
| GET | `/api/projects/:id/similar` | Get similar projects | Any |

### 4.5 Job Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/jobs` | List jobs (public) | Any |
| GET | `/api/jobs/:id` | Job detail | Any |
| POST | `/api/jobs` | Create listing | Enterprise |
| PUT | `/api/jobs/:id` | Update listing | Enterprise (owner) |
| PATCH | `/api/jobs/:id/status` | Close/fill listing | Enterprise (owner) |
| POST | `/api/jobs/:id/apply` | Apply to job | Student |
| GET | `/api/jobs/:id/applications` | List applications | Enterprise (owner) |

### 4.6 Application Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/applications` | My applications | Student |
| GET | `/api/applications/:id` | Application detail | Student/Enterprise |
| PATCH | `/api/applications/:id/status` | Update status | Enterprise |

### 4.7 Interview Endpoints (Proxy to FastAPI)

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/interview/start` | Start AI interview | Student |
| POST | `/api/interview/answer` | Submit answer | Student |
| GET | `/api/interview/:sessionId/history` | Get history | Student |
| GET | `/api/interview/:sessionId/scores` | Get scores | Student |
| DELETE | `/api/interview/:sessionId` | End session | Student |

### 4.8 Messaging Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/conversations` | List conversations | Student/Enterprise |
| POST | `/api/conversations` | Start conversation | Enterprise |
| GET | `/api/conversations/:id` | Get messages | Participant |
| POST | `/api/conversations/:id/messages` | Send message | Participant |
| POST | `/api/conversations/:id/offer` | Send job offer | Enterprise |
| PATCH | `/api/offers/:id` | Accept/decline offer | Student |

### 4.9 Admin Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/admin/users` | List users | Admin |
| PATCH | `/api/admin/users/:id/role` | Change role | Admin |
| PATCH | `/api/admin/users/:id/status` | Ban/activate | Admin |
| GET | `/api/admin/enterprises/pending` | Pending approvals | Admin |
| PATCH | `/api/admin/enterprises/:id/approve` | Approve enterprise | Admin |
| GET | `/api/admin/listings` | All listings | Admin |
| PATCH | `/api/admin/listings/:id/moderate` | Moderate listing | Admin |
| GET | `/api/admin/analytics` | Analytics data | Admin |
| GET | `/api/admin/audit-logs` | Audit logs | Admin |

### 4.10 Edition Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/editions` | List all editions | Public |
| GET | `/api/editions/:year` | Edition detail | Public |
| POST | `/api/editions` | Create edition | Admin |
| PUT | `/api/editions/:year` | Update edition | Admin |
| POST | `/api/editions/:year/media` | Upload media | Admin |
| DELETE | `/api/editions/:year/media/:id` | Delete media | Admin |

---

## 5. MongoDB Schema

### 5.1 Users Collection

```javascript
{
  _id: ObjectId,
  email: String,              // unique, indexed
  passwordHash: String,
  role: String,               // "STUDENT" | "ENTERPRISE" | "ADMIN"
  status: String,             // "pending_verification" | "pending_approval" | "active" | "banned"
  emailVerified: Boolean,
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date
}
// Indexes: email (unique), role, status
```

### 5.2 StudentProfiles Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // ref: Users, unique
  username: String,           // unique, for public URL
  firstName: String,
  lastName: String,
  avatarUrl: String,
  bannerUrl: String,
  about: String,              // max 500 chars
  skills: [String],           // tags
  studyYear: String,          // "1A", "2A", "3A", etc.
  specialization: String,
  linkedinUrl: String,
  githubUrl: String,
  portfolioUrl: String,
  lookingForInternship: Boolean,
  cvId: ObjectId,             // ref: CVs (current CV)
  onboardingComplete: Boolean,
  createdAt: Date,
  updatedAt: Date
}
// Indexes: userId (unique), username (unique), lookingForInternship
```

### 5.3 EnterpriseProfiles Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // ref: Users, unique
  slug: String,               // unique, for public URL
  companyName: String,
  logoUrl: String,
  bannerUrl: String,
  description: String,
  industry: String,
  website: String,
  location: String,
  size: String,               // "1-10", "11-50", etc.
  contactName: String,
  contactPosition: String,
  onboardingComplete: Boolean,
  approvedBy: ObjectId,       // ref: Users (admin)
  approvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
// Indexes: userId (unique), slug (unique)
```

### 5.4 CVs Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // ref: Users
  templateId: String,
  sections: [{
    id: String,
    type: String,             // "personal", "education", "experience", "skills", "projects", "languages", "custom"
    title: String,
    order: Number,
    visible: Boolean,
    content: Mixed            // structure depends on type
  }],
  pdfUrl: String,             // generated PDF location
  pdfGeneratedAt: Date,
  lastScoreResult: {
    score: Number,
    scoredAt: Date,
    feedback: Object
  },
  version: Number,
  createdAt: Date,
  updatedAt: Date
}
// Indexes: userId
```

### 5.5 Projects Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // ref: Users
  title: String,
  slug: String,
  description: String,        // rich text / markdown
  shortDescription: String,   // max 200 chars
  images: [{
    url: String,
    caption: String,
    order: Number
  }],
  tags: [String],
  technologies: [String],
  liveUrl: String,
  repoUrl: String,
  startDate: Date,
  endDate: Date,
  featured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
// Indexes: userId, tags, technologies (for similar projects)
```

### 5.6 Jobs Collection

```javascript
{
  _id: ObjectId,
  enterpriseId: ObjectId,     // ref: EnterpriseProfiles
  title: String,
  description: String,        // rich text
  requirements: [String],
  responsibilities: [String],
  skills: [String],
  type: String,               // "internship", "pfe"
  duration: String,           // "2 months", "6 months"
  location: String,
  remote: Boolean,
  compensation: String,       // optional
  deadline: Date,
  status: String,             // "open", "closed", "filled"
  chosenStudentId: ObjectId,  // ref: Users (when filled)
  applicationCount: Number,
  viewCount: Number,
  createdAt: Date,
  updatedAt: Date
}
// Indexes: enterpriseId, status, skills, createdAt
```

### 5.7 Applications Collection

```javascript
{
  _id: ObjectId,
  jobId: ObjectId,            // ref: Jobs
  studentId: ObjectId,        // ref: Users
  cvId: ObjectId,             // ref: CVs (snapshot at apply time)
  coverLetter: String,
  answers: [{                 // custom application questions
    question: String,
    answer: String
  }],
  status: String,             // "pending", "reviewed", "shortlisted", "rejected", "accepted"
  statusHistory: [{
    status: String,
    changedAt: Date,
    changedBy: ObjectId
  }],
  notes: String,              // enterprise internal notes
  createdAt: Date,
  updatedAt: Date
}
// Indexes: jobId, studentId (compound unique), status
```

### 5.8 Conversations Collection

```javascript
{
  _id: ObjectId,
  participants: [ObjectId],   // [studentId, enterpriseUserId]
  studentId: ObjectId,
  enterpriseId: ObjectId,     // ref: EnterpriseProfiles
  lastMessageAt: Date,
  lastMessagePreview: String,
  unreadCount: {
    [userId]: Number
  },
  createdAt: Date
}
// Indexes: participants, studentId, enterpriseId, lastMessageAt
```

### 5.9 Messages Collection

```javascript
{
  _id: ObjectId,
  conversationId: ObjectId,   // ref: Conversations
  senderId: ObjectId,         // ref: Users
  content: String,
  type: String,               // "text", "offer"
  offerId: ObjectId,          // ref: JobOffers (if type=offer)
  readAt: Date,
  createdAt: Date
}
// Indexes: conversationId, createdAt
```

### 5.10 JobOffers Collection

```javascript
{
  _id: ObjectId,
  jobId: ObjectId,            // ref: Jobs
  studentId: ObjectId,        // ref: Users
  enterpriseId: ObjectId,     // ref: EnterpriseProfiles
  conversationId: ObjectId,   // ref: Conversations
  messageId: ObjectId,        // ref: Messages
  status: String,             // "pending", "accepted", "declined"
  declineReason: String,
  respondedAt: Date,
  createdAt: Date
}
// Indexes: studentId, enterpriseId, status
```

### 5.11 InterviewSessions Collection

```javascript
{
  _id: ObjectId,
  fastApiSessionId: String,   // session ID from FastAPI
  userId: ObjectId,           // ref: Users
  jobId: ObjectId,            // ref: Jobs (optional)
  role: String,               // job title used for interview
  status: String,             // "active", "completed", "abandoned"
  questionCount: Number,
  scores: {
    technical: Number,
    communication: Number,
    problemSolving: Number,
    overall: Number
  },
  startedAt: Date,
  completedAt: Date
}
// Indexes: userId, jobId, status
```

### 5.12 ForumEditions Collection

```javascript
{
  _id: ObjectId,
  year: Number,               // unique, e.g. 2024
  title: String,
  description: String,        // rich text about that year
  highlights: [String],       // key achievements
  charteGraphique: [{
    name: String,
    url: String,
    fileSize: Number
  }],
  gallery: [{
    url: String,
    caption: String,
    order: Number
  }],
  statistics: {
    studentsParticipated: Number,
    companiesParticipated: Number,
    internshipsOffered: Number
  },
  published: Boolean,
  createdAt: Date,
  updatedAt: Date
}
// Indexes: year (unique)
```

### 5.13 MediaAssets Collection

```javascript
{
  _id: ObjectId,
  uploadedBy: ObjectId,       // ref: Users
  filename: String,
  originalName: String,
  mimeType: String,
  size: Number,
  url: String,
  storageKey: String,         // S3 key or local path
  storageProvider: String,    // "local" | "s3"
  purpose: String,            // "avatar", "banner", "cv-pdf", "project-image", "edition-media"
  entityType: String,         // "user", "project", "edition", etc.
  entityId: ObjectId,
  createdAt: Date
}
// Indexes: uploadedBy, entityType+entityId
```

### 5.14 Notifications Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // ref: Users
  type: String,               // "new_message", "application_update", "new_offer", etc.
  title: String,
  body: String,
  data: Object,               // { jobId, conversationId, etc. }
  read: Boolean,
  readAt: Date,
  createdAt: Date
}
// Indexes: userId, read, createdAt
```

### 5.15 AuditLogs Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // who performed action
  action: String,             // "user.login", "job.create", "admin.approve_enterprise"
  entityType: String,
  entityId: ObjectId,
  details: Object,            // additional context
  ip: String,
  userAgent: String,
  createdAt: Date
}
// Indexes: userId, action, createdAt (TTL: 90 days)
```

---

## 6. Workflow UX

### 6.1 Student Journey

```
┌──────────────────────────────────────────────────────────────────┐
│  STUDENT FLOW                                                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. SIGNUP                                                        │
│     └─▶ Enter @enetcom email → Verify email → Multi-step wizard  │
│         ├─ Step 1: Basic info (name, study year, specialization) │
│         ├─ Step 2: Skills & interests                            │
│         ├─ Step 3: Social links (optional)                       │
│         └─ Step 4: Profile photo (optional) → Dashboard          │
│                                                                   │
│  2. BUILD CV                                                      │
│     └─▶ Dashboard → CV Designer                                  │
│         ├─ Choose template                                        │
│         ├─ Add/reorder sections (drag & drop)                    │
│         ├─ Live preview (WYSIWYG)                                │
│         ├─ Get ATS score → View suggestions                      │
│         └─ Export PDF (matches preview exactly)                  │
│                                                                   │
│  3. BROWSE & APPLY                                                │
│     └─▶ Jobs page → Filter by skills/type → Job detail           │
│         ├─ Must have CV on profile to apply                      │
│         ├─ Fill application form (cover letter + questions)      │
│         └─ Track status in "My Applications"                     │
│                                                                   │
│  4. AI INTERVIEW (Optional)                                       │
│     └─▶ Job detail → "Practice Interview" button                 │
│         ├─ Sends job description + student CV to AI              │
│         ├─ 5-10 questions, real-time feedback                    │
│         └─ Final scores saved to profile (private)               │
│                                                                   │
│  5. MESSAGING                                                     │
│     └─▶ Enterprise initiates contact → Student receives          │
│         ├─ Real-time chat (Socket.io)                            │
│         ├─ May receive job offer in chat                         │
│         └─ Accept/Decline offer (with reason if decline)         │
│                                                                   │
│  6. PROJECTS                                                      │
│     └─▶ Add projects to profile                                  │
│         ├─ Title, description, images, tags                      │
│         ├─ Public project page                                   │
│         └─ "Similar projects" engine for discovery               │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 6.2 Enterprise Journey

```
┌──────────────────────────────────────────────────────────────────┐
│  ENTERPRISE FLOW                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. SIGNUP (Admin-Approved)                                       │
│     └─▶ Register with company email → Pending approval screen   │
│         ├─ Admin receives notification                           │
│         ├─ Admin approves → Enterprise gets email                │
│         └─ First login → Multi-step wizard                       │
│             ├─ Step 1: Company info (name, industry, size)       │
│             ├─ Step 2: Contact person details                    │
│             ├─ Step 3: Logo + description                        │
│             └─ Step 4: Verify → Dashboard                        │
│                                                                   │
│  2. CREATE LISTING                                                │
│     └─▶ Dashboard → New Listing                                  │
│         ├─ Title, description, requirements                      │
│         ├─ Skills tags, duration, location, remote option        │
│         ├─ Custom application questions (optional)               │
│         └─ Publish → Visible to students                         │
│                                                                   │
│  3. MANAGE LISTINGS                                               │
│     └─▶ Dashboard → My Listings                                  │
│         ├─ View applications per listing                         │
│         ├─ Update status: Open → Closed → Filled                 │
│         └─ Mark chosen student when filled                       │
│                                                                   │
│  4. BROWSE CANDIDATES                                             │
│     └─▶ Candidates page → Filter by skills, year, looking status│
│         ├─ View student profiles + CVs + projects                │
│         └─ Initiate conversation                                 │
│                                                                   │
│  5. MESSAGING + OFFERS                                            │
│     └─▶ Messages → Chat with student                             │
│         ├─ Real-time messaging                                   │
│         ├─ "Send Offer" button → Select listing → Send           │
│         └─ Track offer status (pending/accepted/declined)        │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 6.3 Admin Journey

```
┌──────────────────────────────────────────────────────────────────┐
│  ADMIN FLOW                                                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. ENTERPRISE APPROVALS                                          │
│     └─▶ Admin Dashboard → Pending Enterprises                   │
│         ├─ Review company info                                   │
│         └─ Approve or Reject (with reason)                       │
│                                                                   │
│  2. USER MANAGEMENT                                               │
│     └─▶ Users page → Search/filter                               │
│         ├─ View user details                                     │
│         ├─ Change role (promote to admin)                        │
│         └─ Ban/suspend accounts                                  │
│                                                                   │
│  3. CONTENT MODERATION                                            │
│     └─▶ Listings page → Flag/remove inappropriate content        │
│                                                                   │
│  4. FORUM EDITIONS                                                │
│     └─▶ Editions → Add new year                                  │
│         ├─ Upload charte graphique PDFs                          │
│         ├─ Add gallery images                                    │
│         ├─ Write description + highlights                        │
│         └─ Publish                                               │
│                                                                   │
│  5. ANALYTICS                                                     │
│     └─▶ Dashboard shows: signups, applications, placements       │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 7. UI Design System

### 7.1 Design Principles

1. **Clean, not sterile** — Warm neutrals over cold grays
2. **Human copywriting** — Short sentences, concrete language, no corporate fluff
3. **Purposeful motion** — Subtle animations that guide, not distract
4. **Mobile-first** — Responsive layouts, touch-friendly targets

### 7.2 Color Palette

```css
:root {
  /* Primary — Deep Blue (trust, professionalism) */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;

  /* Secondary — Warm Amber (energy, optimism) */
  --secondary-50: #fffbeb;
  --secondary-100: #fef3c7;
  --secondary-500: #f59e0b;
  --secondary-600: #d97706;

  /* Neutral — Warm Gray */
  --neutral-50: #fafaf9;
  --neutral-100: #f5f5f4;
  --neutral-200: #e7e5e4;
  --neutral-300: #d6d3d1;
  --neutral-500: #78716c;
  --neutral-700: #44403c;
  --neutral-900: #1c1917;

  /* Semantic */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;

  /* Surfaces */
  --surface-primary: #ffffff;
  --surface-secondary: #fafaf9;
  --surface-elevated: #ffffff;
}
```

### 7.3 Typography Scale

```css
:root {
  /* Font Family */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Type Scale (based on 1.25 ratio) */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### 7.4 Spacing Scale

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
}
```

### 7.5 Border Radius

```css
:root {
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-2xl: 1.5rem;   /* 24px */
  --radius-full: 9999px;
}
```

### 7.6 Shadows

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
```

### 7.7 Layout Grid

```css
/* Container */
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

@media (min-width: 640px) {
  .container { padding: 0 var(--space-6); }
}

@media (min-width: 1024px) {
  .container { padding: 0 var(--space-8); }
}

/* Breakpoints */
--screen-sm: 640px;
--screen-md: 768px;
--screen-lg: 1024px;
--screen-xl: 1280px;
```

### 7.8 Component Inventory

| Component | Description |
|-----------|-------------|
| **Navbar** | Sticky, blur backdrop, role-based nav items |
| **Hero** | Full-width, gradient background, clear CTA |
| **Card** | Surface with shadow, subtle hover lift |
| **Button** | Primary, secondary, ghost, destructive variants |
| **Input** | Bordered, focus ring, error states |
| **Tabs** | Underline style, keyboard accessible |
| **Stepper** | Horizontal steps for wizard flows |
| **Modal** | Centered, backdrop blur, trap focus |
| **Toast** | Bottom-right stack, auto-dismiss |
| **Avatar** | Rounded, fallback initials |
| **Badge** | Status indicators (pending, active, etc.) |
| **Empty State** | Illustration + message + CTA |
| **Gallery** | Grid layout, lightbox on click |
| **Message Bubble** | Left/right aligned, timestamps |
| **CV Preview** | PDF-like render in browser |
| **Job Card** | Title, company, tags, quick actions |

### 7.9 Copywriting Rules

1. **Be direct** — "Find your internship" not "Unlock your career potential"
2. **Use active voice** — "We review applications" not "Applications are reviewed"
3. **Short sentences** — Max 15 words per sentence for UI copy
4. **No jargon** — "Sign up" not "Create an account to access the platform"
5. **Concrete numbers** — "50+ companies hiring" not "Many opportunities available"
6. **Action verbs** — "Apply now", "Start building", "Send message"

---

## 8. BackendRef Integration

### 8.1 Overview

The existing `/backendRef` FastAPI service provides:

| Feature | Endpoint | Method |
|---------|----------|--------|
| Resume ATS Scoring | `/api/resume/analyze` | POST (multipart/form-data) |
| Skill Extraction | `/api/resume/extract-skills` | POST (multipart/form-data) |
| Start Interview | `/api/interview/start` | POST (JSON) |
| Submit Answer | `/api/interview/answer` | POST (JSON) |
| Get History | `/api/interview/history/{session_id}` | GET |
| Get Scores | `/api/interview/scores/{session_id}` | GET |
| End Session | `/api/interview/session/{session_id}` | DELETE |

### 8.2 Integration Architecture

```
┌─────────────┐     ┌────────────────┐     ┌─────────────────┐
│   Next.js   │────▶│  Node/Express  │────▶│    FastAPI      │
│   Client    │     │  (Proxy Layer) │     │  (backendRef)   │
└─────────────┘     └────────────────┘     └─────────────────┘
                           │
                    ┌──────┴──────┐
                    │ What Node   │
                    │ handles:    │
                    │ - Auth      │
                    │ - Rate limit│
                    │ - Logging   │
                    │ - File prep │
                    └─────────────┘
```

### 8.3 CV Scoring Flow

```javascript
// Node.js endpoint: POST /api/cv/score

async function scoreCV(req, res) {
  // 1. Validate user is authenticated
  const userId = req.user.id;
  
  // 2. Get user's CV PDF from storage
  const cv = await CV.findOne({ userId });
  const pdfBuffer = await storage.getFile(cv.pdfUrl);
  
  // 3. Create FormData for FastAPI
  const formData = new FormData();
  formData.append('file', pdfBuffer, 'cv.pdf');
  
  // Optional: Add job context if scoring for specific job
  if (req.body.jobId) {
    const job = await Job.findById(req.body.jobId);
    formData.append('job_description', job.description);
    formData.append('job_title', job.title);
  }
  
  // 4. Call FastAPI
  const response = await fetch(`${FASTAPI_URL}/api/resume/analyze`, {
    method: 'POST',
    body: formData,
    headers: {
      'X-Internal-Key': process.env.INTERNAL_API_KEY
    }
  });
  
  // 5. Store result and return
  const result = await response.json();
  
  await CV.updateOne(
    { _id: cv._id },
    {
      lastScoreResult: {
        score: result.overall_score,
        scoredAt: new Date(),
        feedback: result
      }
    }
  );
  
  return res.json(result);
}
```

### 8.4 AI Interview Flow

```javascript
// Node.js endpoint: POST /api/interview/start

async function startInterview(req, res) {
  const { jobId } = req.body;
  const userId = req.user.id;
  
  // 1. Get student's CV text
  const cv = await CV.findOne({ userId });
  const cvText = await extractTextFromPDF(cv.pdfUrl);
  
  // 2. Get job role (if job specified)
  let role = 'Software Engineer'; // default
  if (jobId) {
    const job = await Job.findById(jobId);
    role = job.title;
  }
  
  // 3. Call FastAPI
  const response = await fetch(`${FASTAPI_URL}/api/interview/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Internal-Key': process.env.INTERNAL_API_KEY
    },
    body: JSON.stringify({
      cv_text: cvText,
      role: role
    })
  });
  
  const { session_id, first_question, cv_summary } = await response.json();
  
  // 4. Store session in MongoDB
  const session = await InterviewSession.create({
    fastApiSessionId: session_id,
    userId,
    jobId,
    role,
    status: 'active',
    questionCount: 1,
    startedAt: new Date()
  });
  
  return res.json({
    sessionId: session._id,
    firstQuestion: first_question,
    cvSummary: cv_summary
  });
}
```

### 8.5 Environment Variables

```env
# backendRef/.env (existing)
AI_API_KEY=<existing-key>
AI_BASE_URL=https://integrate.api.nvidia.com/v1
AI_MODEL=meta/llama-3.1-405b-instruct

# backend/.env (new)
FASTAPI_URL=http://localhost:8000
INTERNAL_API_KEY=<generate-random-key>

# backendRef/.env (add this)
INTERNAL_API_KEY=<same-key-as-backend>
```

### 8.6 FastAPI Auth Middleware (Add to backendRef)

```python
# Add to backendRef/app/core/auth.py

from fastapi import Request, HTTPException
import os

INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY", "")

async def verify_internal_key(request: Request):
    """Verify requests come from trusted Node backend"""
    key = request.headers.get("X-Internal-Key")
    if not key or key != INTERNAL_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid internal key")
```

---

## 9. Dev Setup

### 9.1 Prerequisites

- Node.js 18+
- Python 3.9+
- MongoDB (local or Atlas)
- pnpm (recommended) or npm

### 9.2 Environment Variables

**frontend/.env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

**backend/.env**
```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/enetcom-forum

# Auth
JWT_SECRET=<generate-32-char-secret>
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=<generate-32-char-secret>
REFRESH_TOKEN_EXPIRES_IN=30d

# Cookies
COOKIE_DOMAIN=localhost
COOKIE_SECURE=false

# FastAPI
FASTAPI_URL=http://localhost:8000
INTERNAL_API_KEY=<generate-random-key>

# Email (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@gmail.com
SMTP_PASS=<password>
FROM_EMAIL=ENET'Com Forum <noreply@gmail.com>

# Storage
STORAGE_PROVIDER=local
UPLOAD_DIR=./uploads

# S3 (for production)
# STORAGE_PROVIDER=s3
# S3_BUCKET=enetcom-forum
# S3_REGION=eu-west-1
# S3_ACCESS_KEY=<key>
# S3_SECRET_KEY=<secret>
```

**backendRef/.env** (existing + add)
```env
AI_API_KEY=<existing>
AI_BASE_URL=https://integrate.api.nvidia.com/v1
AI_MODEL=meta/llama-3.1-405b-instruct
INTERNAL_API_KEY=<same-as-backend>
```

### 9.3 Local Run Steps

```bash
# 1. Clone and install
git clone <repo>
cd enetcom-forum

# 2. Install frontend dependencies
cd frontend
pnpm install

# 3. Install backend dependencies
cd ../backend
pnpm install

# 4. Setup backendRef
cd ../backendRef
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 5. Start MongoDB (if local)
mongod --dbpath /path/to/data

# 6. Start all services (use 3 terminals)

# Terminal 1: FastAPI
cd backendRef
python main.py
# Running on http://localhost:8000

# Terminal 2: Node/Express
cd backend
pnpm dev
# Running on http://localhost:5000

# Terminal 3: Next.js
cd frontend
pnpm dev
# Running on http://localhost:3000
```

### 9.4 Recommended Scripts (package.json)

```json
// Root package.json
{
  "scripts": {
    "dev": "concurrently \"pnpm --filter frontend dev\" \"pnpm --filter backend dev\"",
    "dev:python": "cd backendRef && python main.py",
    "dev:all": "concurrently \"pnpm dev\" \"pnpm dev:python\"",
    "build": "pnpm --filter frontend build && pnpm --filter backend build",
    "lint": "pnpm --filter frontend lint && pnpm --filter backend lint"
  }
}
```

---

## 10. Risks & Mitigations

### 10.1 PDF Generation Fidelity

| Risk | CV exported PDF doesn't match browser preview |
|------|----------------------------------------------|
| Impact | High — breaks user trust |
| Mitigation | Use Puppeteer for PDF generation (renders HTML exactly as seen). Test across templates. Provide "download preview" before final export. |

### 10.2 Messaging Reliability

| Risk | Socket.io messages lost or not delivered |
|------|------------------------------------------|
| Impact | Medium — affects user experience |
| Mitigation | Persist messages to MongoDB before emitting. Implement message acknowledgment. Show "sending" state until confirmed. Fallback to polling if socket disconnects. |

### 10.3 FastAPI Availability

| Risk | AI service down = ATS scoring & interviews fail |
|------|------------------------------------------------|
| Impact | High for those features |
| Mitigation | Graceful degradation — show "AI features temporarily unavailable". Implement retry with exponential backoff. Health check endpoint monitoring. Queue requests during outages. |

### 10.4 Security

| Risk | Unauthorized access, data leaks |
|------|--------------------------------|
| Impact | Critical |
| Mitigation | JWT in HTTP-only cookies. RBAC middleware on all routes. Input validation (zod). Rate limiting. CORS whitelist. File upload validation (type, size). SQL injection N/A (MongoDB), but sanitize inputs. XSS prevention (React escapes by default). CSRF tokens for state-changing requests. |

### 10.5 Email Deliverability

| Risk | Verification/reset emails go to spam |
|------|-------------------------------------|
| Impact | Medium — blocks user onboarding |
| Mitigation | Use transactional email service (SendGrid, Resend). Proper SPF/DKIM/DMARC on domain. Test with multiple email providers. |

### 10.6 Data Privacy

| Risk | Student data exposed or misused |
|------|--------------------------------|
| Impact | Critical |
| Mitigation | Minimize data collection. Private by default (lookingForInternship opt-in). Enterprises see limited profile until student applies. No public email display. GDPR-like data export/deletion (future). Audit logs for sensitive actions. |

### 10.7 Scalability

| Risk | Performance degrades with user growth |
|------|--------------------------------------|
| Impact | Medium |
| Mitigation | MongoDB indexes on query fields. Pagination on all list endpoints. CDN for static assets. Consider Redis for sessions/cache (future). Horizontal scaling for Node (stateless design). |

---

## 11. Milestones

### Phase 1: Foundation (Week 1-2)

**Agent**: `backend-specialist`

| Task | Description | Est. |
|------|-------------|------|
| 1.1 | Project scaffolding (Next.js + Express + folder structure) | 2h |
| 1.2 | MongoDB connection + base models (Users, StudentProfiles, EnterpriseProfiles) | 3h |
| 1.3 | Auth system: register, login, logout, JWT cookies | 6h |
| 1.4 | Email verification flow | 3h |
| 1.5 | Password reset flow | 2h |
| 1.6 | RBAC middleware | 2h |
| 1.7 | Storage abstraction (local + S3 interface) | 3h |

### Phase 2: Auth UI + Onboarding (Week 2-3)

**Agent**: `frontend-specialist`

| Task | Description | Est. |
|------|-------------|------|
| 2.1 | Design system setup (CSS variables, base components) | 4h |
| 2.2 | Login page | 2h |
| 2.3 | Register flow: role selection → appropriate wizard | 4h |
| 2.4 | Student onboarding wizard (4 steps) | 4h |
| 2.5 | Enterprise onboarding wizard (4 steps) | 4h |
| 2.6 | Email verification page | 1h |
| 2.7 | Password reset pages | 2h |

### Phase 3: Public Pages (Week 3)

**Agent**: `frontend-specialist`

| Task | Description | Est. |
|------|-------------|------|
| 3.1 | Landing page (hero, features, stats, CTA) | 6h |
| 3.2 | Navbar (public + auth states) | 2h |
| 3.3 | Footer | 1h |
| 3.4 | Editions list page | 2h |
| 3.5 | Edition detail page (description, PDFs, gallery) | 4h |
| 3.6 | ForumEditions API + admin CRUD | 3h |

### Phase 4: CV Designer (Week 4-5)

**Agent**: `frontend-specialist` + `backend-specialist`

| Task | Description | Est. |
|------|-------------|------|
| 4.1 | CV data model + API endpoints | 3h |
| 4.2 | CV Designer UI: section management, drag-drop | 8h |
| 4.3 | CV preview component (WYSIWYG) | 6h |
| 4.4 | Template system (2-3 templates) | 4h |
| 4.5 | PDF export (Puppeteer) | 4h |
| 4.6 | PDF upload (alternative to designer) | 2h |

### Phase 5: ATS Scoring (Week 5)

**Agent**: `backend-specialist`

| Task | Description | Est. |
|------|-------------|------|
| 5.1 | FastAPI integration: internal auth | 2h |
| 5.2 | Node proxy: /api/cv/score | 2h |
| 5.3 | Score result UI (overall score, criteria, suggestions) | 4h |
| 5.4 | Store score history | 1h |

### Phase 6: Jobs & Applications (Week 6-7)

**Agent**: `backend-specialist` + `frontend-specialist`

| Task | Description | Est. |
|------|-------------|------|
| 6.1 | Jobs model + CRUD API | 4h |
| 6.2 | Applications model + API | 3h |
| 6.3 | Job listings page (search, filter, pagination) | 6h |
| 6.4 | Job detail page | 3h |
| 6.5 | Application form + submission | 4h |
| 6.6 | My Applications page (student) | 3h |
| 6.7 | Enterprise: create/edit listing UI | 4h |
| 6.8 | Enterprise: view applications per listing | 3h |

### Phase 7: AI Interview (Week 7-8)

**Agent**: `backend-specialist` + `frontend-specialist`

| Task | Description | Est. |
|------|-------------|------|
| 7.1 | Interview session model | 2h |
| 7.2 | Node proxy: interview endpoints | 3h |
| 7.3 | Interview UI: start, Q&A flow, code editor | 8h |
| 7.4 | Interview results/scores UI | 3h |
| 7.5 | Link interview to job detail page | 2h |

### Phase 8: Messaging (Week 8-9)

**Agent**: `backend-specialist` + `frontend-specialist`

| Task | Description | Est. |
|------|-------------|------|
| 8.1 | Conversations + Messages models | 2h |
| 8.2 | Socket.io server setup | 3h |
| 8.3 | Conversation list UI | 3h |
| 8.4 | Chat thread UI (real-time) | 6h |
| 8.5 | Job offers in chat | 4h |
| 8.6 | Accept/decline offer flow | 3h |
| 8.7 | Unread indicators | 2h |

### Phase 9: Projects & Profiles (Week 9-10)

**Agent**: `frontend-specialist`

| Task | Description | Est. |
|------|-------------|------|
| 9.1 | Projects model + CRUD API | 3h |
| 9.2 | Project form (images, tags) | 4h |
| 9.3 | Project detail page | 3h |
| 9.4 | Similar projects engine (tag-based) | 3h |
| 9.5 | Student public profile page | 4h |
| 9.6 | Enterprise public profile page | 3h |
| 9.7 | Profile edit pages | 4h |

### Phase 10: Admin Dashboard (Week 10-11)

**Agent**: `frontend-specialist` + `backend-specialist`

| Task | Description | Est. |
|------|-------------|------|
| 10.1 | Admin layout + navigation | 2h |
| 10.2 | User management (list, search, role change, ban) | 4h |
| 10.3 | Enterprise approval queue | 3h |
| 10.4 | Listings moderation | 2h |
| 10.5 | Analytics dashboard (basic stats) | 4h |
| 10.6 | Audit logs viewer | 2h |

### Phase 11: Polish & Security (Week 11-12)

**Agent**: `security-auditor` + `frontend-specialist`

| Task | Description | Est. |
|------|-------------|------|
| 11.1 | Rate limiting on all endpoints | 2h |
| 11.2 | Input validation audit (zod schemas) | 3h |
| 11.3 | Security headers (helmet) | 1h |
| 11.4 | CORS policy for production | 1h |
| 11.5 | File upload security audit | 2h |
| 11.6 | Empty states for all lists | 2h |
| 11.7 | Error handling UI | 2h |
| 11.8 | Loading states | 2h |
| 11.9 | Toast notifications | 2h |
| 11.10 | Responsive audit | 4h |

### Phase 12: Deployment (Week 12)

**Agent**: `backend-specialist`

| Task | Description | Est. |
|------|-------------|------|
| 12.1 | Vercel deployment (Next.js) | 2h |
| 12.2 | Render/Railway deployment (Node) | 3h |
| 12.3 | Render/Railway deployment (FastAPI) | 2h |
| 12.4 | MongoDB Atlas setup | 1h |
| 12.5 | S3/R2 setup | 2h |
| 12.6 | Environment variables configuration | 1h |
| 12.7 | DNS + SSL | 1h |
| 12.8 | Smoke testing | 2h |

---

## Summary

| Metric | Value |
|--------|-------|
| Total Phases | 12 |
| Total Tasks | ~80 |
| Estimated Hours | ~220h |
| Estimated Duration | 12 weeks (part-time) or 6 weeks (full-time) |

**Primary Agents Used**:
- `backend-specialist` — API, database, auth, integrations
- `frontend-specialist` — UI, components, pages
- `security-auditor` — Final security audit

---

*Plan created: 2026-01-31*
*Last updated: 2026-01-31*
