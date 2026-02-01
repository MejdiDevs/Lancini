# Email Verification Setup Guide

## EmailJS Configuration

The platform uses EmailJS for sending verification emails. Follow these steps to set it up:

### 1. Create EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Create Email Service

1. Go to **Email Services** in the dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. Copy the **Service ID**

### 3. Create Email Template

1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template structure:

**Subject:** Verify Your Email - ENET'Com Forum

**Content:**
```html
Hello {{to_name}},

Welcome to ENET'Com Forum! Please verify your email address to complete your registration.

Click the link below to verify your email:
{{verification_url}}

This link will expire in 24 hours.

If you didn't create an account, please ignore this email.

Best regards,
{{from_name}}
```

4. Save the template and copy the **Template ID**

### 4. Get API Keys

1. Go to **Account** → **General**
2. Copy your **Public Key**
3. Go to **Account** → **API Keys**
4. Create a new **Private Key** and copy it

### 5. Update Environment Variables

Edit `backend/.env` and add your EmailJS credentials:

```env
EMAILJS_SERVICE_ID=service_xxxxxxx
EMAILJS_TEMPLATE_ID=template_xxxxxxx
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key
```

### 6. Test the Setup

1. Register a new student account
2. Check the console logs for "📧 Verification email sent to..."
3. Check your email inbox for the verification link
4. Click the link to verify

## Email Verification Flow

### Registration
1. User registers with `@gmail.com` email
2. Account created with `status: 'pending_verification'`
3. Verification token generated (32-byte random hex)
4. Token expires in 24 hours
5. Verification email sent via EmailJS
6. User receives email with verification link

### Verification
1. User clicks link: `/auth/verify-email?token=xxx`
2. Backend validates token and expiration
3. If valid:
   - `emailVerified` set to `true`
   - `status` changed to `'active'`
   - Token cleared
4. User redirected to login page

### Login
1. User attempts to login
2. Backend checks `emailVerified` status
3. If not verified:
   - Login blocked
   - Error message shown
   - Option to resend verification email
4. If verified:
   - JWT token issued
   - User logged in

## API Endpoints

### POST `/api/auth/register/student`
Creates account and sends verification email

**Request:**
```json
{
  "email": "john.doe@gmail.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "studyYear": "3A"
}
```

**Response:**
```json
{
  "message": "Registration successful! Please check your email to verify your account.",
  "email": "john.doe@gmail.com",
  "requiresVerification": true
}
```

### GET `/api/auth/verify-email?token=xxx`
Verifies email with token

**Response:**
```json
{
  "message": "Email verified successfully! You can now log in.",
  "success": true
}
```

### POST `/api/auth/resend-verification`
Resends verification email

**Request:**
```json
{
  "email": "john.doe@gmail.com"
}
```

**Response:**
```json
{
  "message": "Verification email sent! Please check your inbox.",
  "success": true
}
```

## Frontend Integration

### Verification Page
- Located at `/auth/verify-email`
- Automatically verifies token from URL
- Shows success/error status
- Redirects to login after 3 seconds

### Registration Flow
1. User fills registration form
2. On success, show message: "Check your email to verify your account"
3. Provide "Resend Email" button
4. Redirect to login page

### Login Flow
1. User attempts login
2. If `requiresVerification: true` in error:
   - Show verification required message
   - Provide "Resend Verification Email" button
3. If verified, proceed with normal login

## Troubleshooting

### Email Not Received
1. Check spam/junk folder
2. Verify EmailJS credentials in `.env`
3. Check console logs for errors
4. Verify email template is active
5. Check EmailJS dashboard for delivery status

### Token Expired
1. User can request new verification email
2. Use `/api/auth/resend-verification` endpoint
3. New token generated with 24-hour expiration

### Development Testing
- Verification emails will be sent to real email addresses
- Use a test email account for development
- Check EmailJS dashboard for email history
- Console logs show when emails are sent

## Security Notes

- Tokens are 32-byte random hex strings
- Tokens expire after 24 hours
- One-time use (cleared after verification)
- HTTPS required in production
- Private key never exposed to frontend
