# 🎓 WiseUni Student Registry

A comprehensive AWS Cognito integration demonstration project showcasing authentication, authorization, and role-based access control (RBAC) through a practical student registry application.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [AWS Resources](#aws-resources)
- [Lambda Functions](#lambda-functions)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

WiseUni Student Registry is a full-stack application designed to demonstrate comprehensive AWS Cognito integration patterns. The project implements a role-based access control system where different user types (Students, Professors, and Guests) have distinct interfaces and permissions.

### Key Learning Objectives

- **User Pools**: User registration, authentication, and management
- **Identity Pools**: Federated identity and temporary AWS credentials
- **Hosted UI**: OAuth 2.0 / OIDC authentication flows
- **Lambda Triggers**: Custom authentication workflows
- **IAM Roles**: Role-based access control with policy variables
- **AWS Integration**: S3 and DynamoDB with Cognito-based authorization

## ✨ Features

### Authentication & Authorization

- ✅ User registration with email verification
- ✅ Custom login flows (Hosted UI and SDK-based)
- ✅ Multi-factor authentication (MFA) support
- ✅ Password reset and change functionality
- ✅ JWT token management and refresh
- ✅ Role-based access control (Students, Professors, Guests)

### User Roles

- **Students**: Access to personal dashboard, homework upload, and grade viewing
- **Professors**: Enhanced permissions for managing courses and student data
- **Guest Access**: Limited read-only access for unauthenticated users

### AWS Services Integration

- **S3**: Secure file uploads with presigned URLs
- **DynamoDB**: Student grades and data storage
- **Lambda**: Custom authentication triggers and business logic

## 🏗️ Architecture

```
┌─────────────────┐
│   React Frontend │
│   (TypeScript)   │
└────────┬────────┘
         │
         ├─── Cognito User Pool (Authentication)
         ├─── Cognito Identity Pool (Authorization)
         ├─── Lambda Triggers (Custom Logic)
         ├─── S3 Bucket (File Storage)
         └─── DynamoDB (Data Storage)
```

### Authentication Flow

1. **Sign Up**: User registers → Email verification → Account confirmed
2. **Sign In**: User authenticates → Receives JWT tokens (Access, ID, Refresh)
3. **Authorization**: Identity Pool provides temporary AWS credentials based on user role
4. **Resource Access**: User accesses S3/DynamoDB using temporary credentials

## 🛠️ Tech Stack

### Frontend

- **React 19** with TypeScript
- **React Router** for navigation
- **Vite** for build tooling
- **Amazon Cognito Identity JS** for authentication
- **AWS SDK v3** for S3 and DynamoDB integration

### Backend

- **AWS SAM** for infrastructure as code
- **Python 3.11** for Lambda functions
- **Boto3** for AWS service integration

### AWS Services

- AWS Cognito (User Pool & Identity Pool)
- AWS Lambda
- Amazon S3
- Amazon DynamoDB
- AWS IAM

## 📦 Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.11)
- **AWS CLI** configured with appropriate credentials
- **AWS SAM CLI** installed
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cognito-student-registry
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend/lambda
./scripts/install_lambda_dependencies.sh
```

### 4. Configure AWS Credentials

Ensure your AWS CLI is configured:

```bash
aws configure
```

## ⚙️ Configuration

### 1. Deploy AWS Infrastructure

Deploy the CloudFormation stack using AWS SAM:

```bash
sam build
sam deploy --guided
```

This will create:

- Cognito User Pool
- Cognito Identity Pool
- Lambda functions
- S3 bucket
- DynamoDB table
- IAM roles and policies

### 2. Update Frontend Configuration

After deployment, update `frontend/src/config/cognito.ts` with your AWS resource IDs:

```typescript
export const cognitoConfig = {
  region: "us-east-1",
  userPoolId: "your-user-pool-id",
  userPoolClientId: "your-client-id",
  userPoolDomain: "your-domain",
  identityPoolId: "your-identity-pool-id",
  homeworkBucket: "your-s3-bucket",
  gradesTable: "your-dynamodb-table",
};
```

### 3. Configure Callback URL

Ensure your Cognito User Pool Client has the callback URL configured:

- `http://localhost:5173/callback` (development)
- `https://yourdomain.com/callback` (production)

## 📁 Project Structure

```
cognito-student-registry/
├── backend/
│   ├── lambda/
│   │   ├── pre_signup/          # Email validation trigger
│   │   ├── post_confirmation/   # Welcome email trigger
│   │   ├── pre_authentication/  # Login validation trigger
│   │   └── custom_message/      # Custom email templates
│   └── iam-policies/
│       ├── authenticated-role-policy.json
│       ├── unauthenticated-role.json
│       └── trust-policy.json
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── config/              # Cognito configuration
│   │   ├── services/            # AWS service integrations
│   │   ├── hooks/               # Custom React hooks
│   │   └── pages/               # Page components
│   └── package.json
├── scripts/
│   ├── deploy.sh                # Deployment script
│   ├── setup.sh                 # Setup script
│   └── cleanup.sh               # Cleanup script
├── template.yaml                # SAM template
└── README.md
```

## ☁️ AWS Resources

### Cognito User Pool

- User registration and authentication
- Email verification
- Password policies
- MFA configuration
- Custom attributes (name, student_id)

### Cognito Identity Pool

- Federated identity management
- Temporary AWS credentials
- Role-based access control

### Lambda Functions

| Function                    | Trigger            | Purpose                                          |
| --------------------------- | ------------------ | ------------------------------------------------ |
| `PreSignupFunction`         | Pre-SignUp         | Validate email domain, prevent duplicate signups |
| `PostConfirmationFunction`  | Post-Confirmation  | Send welcome email, initialize user data         |
| `PreAuthenticationFunction` | Pre-Authentication | Validate login attempts, security checks         |
| `CustomMessageFunction`     | Custom Message     | Customize email templates                        |

### IAM Policies

- **Authenticated Role**: Grants access to S3 and DynamoDB for authenticated users
- **Unauthenticated Role**: Limited read-only access for guest users
- **Trust Policy**: Allows Cognito Identity Pool to assume roles

### S3 Bucket

- Stores student homework submissions
- Uses presigned URLs for secure uploads
- Policy variables ensure users can only access their own files

### DynamoDB Table

- Stores student grades and academic records
- Uses policy variables for row-level security
- Access controlled by Cognito identity

## 🔧 Lambda Functions

### Pre-SignUp (`pre_signup/index.py`)

Validates user email before account creation. Can be extended to:

- Check email domain whitelist
- Prevent duplicate registrations
- Validate additional signup data

### Post-Confirmation (`post_confirmation/index.py`)

Executes after email verification:

- Sends welcome email
- Initializes user profile in DynamoDB
- Sets up default permissions

### Pre-Authentication (`pre_authentication/index.py`)

Validates login attempts:

- Checks account status
- Implements security policies
- Can block suspicious login attempts

### Custom Message (`custom_message/index.py`)

Customizes email templates:

- Verification codes
- Password reset emails
- Welcome messages

## 💻 Usage

### Development

Start the frontend development server:

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Routes

- `/` - Home page with project description and configuration
- `/login` - Custom login page
- `/signup` - User registration
- `/callback` - OAuth callback handler
- `/dashboard` - User dashboard (protected)
- `/upload` - Homework upload (protected)
- `/grades` - View grades (protected)

### Testing Authentication

1. **Sign Up**: Navigate to `/signup` and create a new account
2. **Verify Email**: Check your email for verification code
3. **Sign In**: Use `/login` or Hosted UI button on home page
4. **Access Protected Routes**: Navigate to dashboard, upload, or grades

## 🚢 Deployment

### Deploy Infrastructure

```bash
sam build
sam deploy --stack-name wiseuni-stack --capabilities CAPABILITY_IAM
```

### Deploy Frontend

Build and deploy the frontend to your hosting service (S3 + CloudFront, Vercel, Netlify, etc.):

```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting service
```

### Environment Variables

For production, ensure environment variables are set:

- `REACT_APP_COGNITO_REGION`
- `REACT_APP_COGNITO_USER_POOL_ID`
- `REACT_APP_COGNITO_CLIENT_ID`
- `REACT_APP_COGNITO_IDENTITY_POOL_ID`

## 📚 Additional Resources

- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [React Router Documentation](https://reactrouter.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is for educational purposes and demonstration of AWS Cognito integration patterns.

## 👤 Author

Created as a comprehensive learning demonstration of AWS Cognito integration capabilities.

---

**Note**: This project is designed for learning and demonstration purposes. Ensure proper security practices and compliance requirements are met before deploying to production environments.

                       template.yaml (Main)                             │

│ │ │
│ ┌────────────────────┼────────────────────┐ │
│ │ │ │ │
│ ▼ ▼ ▼ │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ cognito.yaml│ │database.yaml│ │ storage.yaml│ │
│ │ │ │ │ │ │ │
│ │ • UserPool │ │ • WiseUni │ │ • Homework │ │
│ │ • Identity │ │ Table │ │ Bucket │ │
│ │ Pool │ │ │ │ │ │
│ │ • Groups │ │ │ │ │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ │
│ │ │ │ │
│ └────────────────────┼────────────────────┘ │
│ │ │
│ ▼ │
│ ┌─────────────────┐ │
│ │ iam-roles.yaml │ │
│ │ │ │
│ │ • StudentRole │ Uses outputs from │
│ │ • ProfessorRole │ other stacks │
│ │ • AdminRole │ │
│ │ • GuestRole │ │
│ └─────────────────┘ │
│ │
│ ┌─────────────────────┐ │
│ │lambda-triggers.yaml │ Created first │
│ │ │ (Cognito depends on it) │
│ │ • PreSignUp │ │
│ │ • PostConfirmation │ │
│ │ • PreAuthentication │ │
│ │ • CustomMessage │ │
│ └─────────────────────┘
