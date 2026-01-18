# Nexus - Centralized Governance Platform

Nexus is a demonstration of a unified digital governance platform connecting citizens to multiple government departments (Healthcare, Agriculture, etc.) through a single, secure gateway. It features a modern microservices architecture with a centralized API Gateway and role-based access control.

## Features

- **Unified Citizen Portal**: Single sign-on for all government services.
- **Role-Based Access**: Specialized dashboards for Citizens, Admins
- **Service Request Management**: Citizens can request services (e.g., Doctor Appointment, Agri Advisory).
- **Inter-Service Communication**: Secure internal communication between Gateway and Department services using JWTs.
- **Department Isolation**: Independent databases and logic for Healthcare and Agriculture departments.
- **Zero-Trust Security**: No direct external access to internal department services.

---

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS v4, Lucide React, Axios.
- **Backend (Gateway & Services)**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose) - Separate databases for Gateway and Departments.
- **Authentication**: JWT (JSON Web Tokens).

---

## Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas URI (or local instance)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd debuging-wizards
```

### 2. Backend Setup
The backend consists of the main **Gateway** and independent **Microservices**. You need to set up all three.

#### **Gateway Service** (Port 5000)
```bash
cd backend
npm install
# Create .env file (see Environment Variables section)
npm run dev
```

#### **Healthcare Service** (Port 5001)
```bash
cd backend/services/healthcare
npm install
# Create .env file
npm run dev
```

#### **Agriculture Service** (Port 5002)
```bash
cd backend/services/agriculture
npm install
# Create .env file
npm run dev
```

#### **Urban Services** (Port 5003)
```bash
cd backend/services/urban
npm install
# Create .env file
npm run dev
```

### 3. Frontend Setup (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create `.env` files in the respective directories using the examples below.

### **Backend Gateway (`backend/.env`)**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
SERVICE_JWT_SECRET=shared_service_secret_key
FRONTEND_URL=http://localhost:5173
HEALTHCARE_URL=http://localhost:5001
AGRICULTURE_URL=http://localhost:5002
URBAN_URL=http://localhost:5003
```

### **Healthcare Service (`backend/services/healthcare/.env`)**
```env
PORT=5001
MONGO_URI=your_healthcare_db_connection_string
SERVICE_JWT_SECRET=shared_service_secret_key
```

### **Agriculture Service (`backend/services/agriculture/.env`)**
```env
PORT=5002
MONGO_URI=your_agriculture_db_connection_string
SERVICE_JWT_SECRET=shared_service_secret_key
```

### **Urban Services (`backend/services/urban/.env`)**
```env
PORT=5003
MONGO_URI=your_urban_db_connection_string
SERVICE_JWT_SECRET=shared_service_secret_key
```

> **Note**: `SERVICE_JWT_SECRET` must be identical across all backend services to allow internal communication.

---

## 🧪 Test Credentials

The system automatically seeds these users if they don't exist:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@nexus.gov` | `admin123` |
| **Healthcare Officer** | `officer.health@nexus.gov` | `officer123` |
| **Agriculture Officer** | `officer.agri@nexus.gov` | `officer123` |

> **Citizen Users**: You can register a new account from the sign up page.

---

## Basic Error Handling & Architecture Note

- If you see `Connection Refused`, ensure all 4 backend services are running (Gateway + 3 microservices).
- **Internal Services**: You cannot access `http://localhost:5001`, `http://localhost:5002`, or `http://localhost:5003` directly from the browser/Postman (except for basic health checks). All requests must go through the Gateway (`http://localhost:5000`).
- **Database**: Ensure your IP is whitelisted in MongoDB Atlas.
