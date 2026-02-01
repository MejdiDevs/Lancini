# Database Overview for Lancini - ENET'Com Forum

This document provides a plain-English explanation of the database structure used in the Lancini platform. The database is built using **MongoDB**, which stores data in "collections" (similar to tables in Excel or SQL).

## 1. Core Users & Profiles

The system separates "Authentication" (login info) from "Profile Details" (public info).

- **User**: This is the central account for logging in.
  - *Stores*: Email, Encrypted Password, Role (Student, Enterprise, or Admin).
  - *Purpose*: Handles security and access control. Every person or company has exactly one User record.

- **StudentProfile**: Extra details for student users.
  - *Stores*: First Name, Last Name, Bio, Skills, Education, Profile Image.
  - *Relationship*: Linked directly to a `User` ID.
  - *Purpose*: Displayed on the public profile page/CV.

- **EnterpriseProfile**: Extra details for company users.
  - *Stores*: Company Name, Website, Description, Logo, Address.
  - *Relationship*: Linked directly to a `User` ID.
  - *Purpose*: Showcased to students browsing for internships.

## 2. Job Market

This section manages the recruitment process.

- **Job**: An internship or PFE opportunity.
  - *Stores*: Title, Description, Requirements, Type (PFE/Internship), Location.
  - *Relationship*: Created by an `Enterprise` (User).
  - *Purpose*: The main listing card seen by students.

- **Application**: A record of a student applying to a job.
  - *Stores*: Status (Pending, Reviewed, Interview, Accepted, Rejected), Application Date.
  - *Relationship*: Links a `Student` (User) to a `Job`.
  - *Purpose*: Tracks who applied to what.

## 3. Career & Tools

Tools to help students prepare and showcase themselves.

- **CV**: A digital resume.
  - *Stores*: Work Experience, Projects, Education (structured data).
  - *Relationship*: Owned by a `Student`.
  - *Purpose*: Used to generate PDF resumes or fill in application forms.

- **Project**: A portfolio item (Showcase).
  - *Stores*: Title, Description, Image, Tags, External Link, **Likes**, **Views**.
  - *Relationship*: Owned by a `Student`.
  - *Purpose*: Students post these to show off their best work.

- **InterviewSession**: AI Mock Interview records.
  - *Stores*: Chat history (Questions & Answers), Scores.
  - *Relationship*: Links a `Student` to a specific `Job` (context for the interview).
  - *Purpose*: Helps students practice answering questions.

## 4. Community & Events

- **Message**: Direct communication.
  - *Stores*: Sender, Receiver, Content, Subject.
  - *Purpose*: Allows students and enterprises to chat.

- **ForumEdition**: An archive of the Forum itself.
  - *Stores*: Year (e.g., 2025), Gallery Images, Statistics (Attendees, Companies), Graphic Charter.
  - *Purpose*: Used to build the "Editions" page showing the history of the event.

## Summary of Relationships

- **One-to-One**: A `User` has one `StudentProfile` (or `EnterpriseProfile`).
- **One-to-Many**: An `Enterprise` posts many `Jobs`.
- **Many-to-Many**: Many `Students` apply to many `Jobs` (via `Application` records).
