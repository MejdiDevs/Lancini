import { Request, Response } from 'express';

export const getApiDocs = (req: Request, res: Response) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ENET'Com Forum API Documentation</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 3rem 2rem;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }
        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        .content {
            padding: 2rem;
        }
        .section {
            margin-bottom: 3rem;
        }
        .section-title {
            font-size: 1.8rem;
            color: #667eea;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 3px solid #667eea;
        }
        .endpoint {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 1.5rem;
            margin-bottom: 1rem;
            border-radius: 4px;
        }
        .endpoint-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 0.5rem;
        }
        .method {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
            font-weight: bold;
            font-size: 0.85rem;
            color: white;
        }
        .method.get { background: #28a745; }
        .method.post { background: #007bff; }
        .method.put { background: #ffc107; color: #333; }
        .method.delete { background: #dc3545; }
        .endpoint-path {
            font-family: 'Courier New', monospace;
            font-size: 1.1rem;
            font-weight: 600;
            color: #333;
        }
        .endpoint-description {
            color: #666;
            margin-bottom: 1rem;
        }
        .params, .response {
            margin-top: 1rem;
        }
        .params h4, .response h4 {
            font-size: 0.9rem;
            color: #667eea;
            margin-bottom: 0.5rem;
        }
        .code-block {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
        }
        .badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            background: #e9ecef;
            border-radius: 3px;
            font-size: 0.8rem;
            margin-left: 0.5rem;
        }
        .badge.auth {
            background: #fff3cd;
            color: #856404;
        }
        .info-box {
            background: #e7f3ff;
            border-left: 4px solid #2196F3;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 4px;
        }
        .info-box strong {
            color: #1976D2;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 ENET'Com Forum API</h1>
            <p>Backend API Documentation v1.0</p>
        </div>
        
        <div class="content">
            <div class="info-box">
                <strong>Base URL:</strong> http://localhost:5000/api<br>
                <strong>Authentication:</strong> JWT tokens stored in HTTP-only cookies<br>
                <strong>Content-Type:</strong> application/json
            </div>

            <!-- Authentication -->
            <div class="section">
                <h2 class="section-title">🔐 Authentication</h2>
                
                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method post">POST</span>
                        <span class="endpoint-path">/auth/register/student</span>
                    </div>
                    <p class="endpoint-description">Register a new student account (requires @gmail.com email)</p>
                    <div class="params">
                        <h4>Request Body:</h4>
                        <pre class="code-block">{
  "email": "john.doe@gmail.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "studyYear": "3A"
}</pre>
                    </div>
                    <div class="response">
                        <h4>Response (201):</h4>
                        <pre class="code-block">{
  "_id": "507f1f77bcf86cd799439011",
  "email": "john.doe@gmail.com",
  "role": "STUDENT"
}</pre>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method post">POST</span>
                        <span class="endpoint-path">/auth/login</span>
                    </div>
                    <p class="endpoint-description">Login with email and password</p>
                    <div class="params">
                        <h4>Request Body:</h4>
                        <pre class="code-block">{
  "email": "ahmed.benali@gmail.com",
  "password": "password123"
}</pre>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method post">POST</span>
                        <span class="endpoint-path">/auth/logout</span>
                    </div>
                    <p class="endpoint-description">Logout current user (clears JWT cookie)</p>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-path">/auth/me</span>
                        <span class="badge auth">🔒 Protected</span>
                    </div>
                    <p class="endpoint-description">Get current authenticated user</p>
                </div>
            </div>

            <!-- CV Management -->
            <div class="section">
                <h2 class="section-title">📄 CV Management</h2>
                
                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-path">/cv</span>
                        <span class="badge auth">🔒 Protected</span>
                    </div>
                    <p class="endpoint-description">Get current user's CV (returns empty template if none exists)</p>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method put">PUT</span>
                        <span class="endpoint-path">/cv</span>
                        <span class="badge auth">🔒 Protected</span>
                    </div>
                    <p class="endpoint-description">Update or create CV</p>
                    <div class="params">
                        <h4>Request Body:</h4>
                        <pre class="code-block">{
  "templateId": "modern",
  "sections": [
    {
      "id": "personal",
      "type": "personal",
      "title": "Personal Info",
      "visible": true,
      "content": { "fullName": "John Doe", "email": "..." }
    }
  ]
}</pre>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method post">POST</span>
                        <span class="endpoint-path">/cv/export</span>
                        <span class="badge auth">🔒 Protected</span>
                    </div>
                    <p class="endpoint-description">Export CV as PDF</p>
                </div>
            </div>

            <!-- Forum Editions -->
            <div class="section">
                <h2 class="section-title">📅 Forum Editions</h2>
                
                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-path">/editions</span>
                    </div>
                    <p class="endpoint-description">Get all published forum editions</p>
                    <div class="response">
                        <h4>Response (200):</h4>
                        <pre class="code-block">[
  {
    "_id": "...",
    "year": 2025,
    "title": "ENET'Com Forum 2025 - Digital Transformation",
    "statistics": {
      "studentsParticipated": 150,
      "companiesParticipated": 45,
      "internshipsOffered": 120
    }
  }
]</pre>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-path">/editions/:year</span>
                    </div>
                    <p class="endpoint-description">Get detailed information for a specific edition</p>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method post">POST</span>
                        <span class="endpoint-path">/editions/seed</span>
                        <span class="badge">⚠️ Dev Only</span>
                    </div>
                    <p class="endpoint-description">Seed demo forum editions data</p>
                </div>
            </div>

            <!-- Test Credentials -->
            <div class="section">
                <h2 class="section-title">🔑 Test Credentials</h2>
                <div class="info-box">
                    <strong>Student Account:</strong><br>
                    Email: ahmed.benali@gmail.com<br>
                    Password: password123<br><br>
                    
                    <strong>Enterprise Account:</strong><br>
                    Email: hr@vermeg.com<br>
                    Password: password123
                </div>
            </div>

            <!-- Database Seeding -->
            <div class="section">
                <h2 class="section-title">🌱 Database Seeding</h2>
                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method post">POST</span>
                        <span class="endpoint-path">npm run seed</span>
                        <span class="badge">CLI Command</span>
                    </div>
                    <p class="endpoint-description">Populate database with demo data:</p>
                    <ul style="margin-left: 2rem; margin-top: 0.5rem;">
                        <li>15 Students with profiles and CVs</li>
                        <li>8 Enterprises (Vermeg, Orange Tunisia, etc.)</li>
                        <li>15-24 Job listings</li>
                        <li>3 Forum editions (2023-2025)</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
  `;

    res.send(html);
};
