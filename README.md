# Healthcare Backend API

A secure RESTful backend API for managing healthcare records (Users, Patients, Doctors, and Patient-Doctor Mappings) built with **Node.js**, **Express.js**, **PostgreSQL**, and **Sequelize ORM**, secured with **JWT Authentication**.

---

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JSON Web Token (JWT) + bcryptjs
- **Environment**: dotenv, cors

---

## 📁 Project Structure

```text
healthbackend/
├── config/
│   └── db.js                 # PostgreSQL connection with Sequelize
├── models/
│   ├── User.js               # User model (name, email, password)
│   ├── Patient.js            # Patient model (name, age, gender, contact, etc.)
│   ├── Doctor.js             # Doctor model (name, specialization, phone, etc.)
│   ├── Mapping.js            # Patient-Doctor Mapping model
│   └── index.js              # Model associations
├── controllers/
│   ├── authController.js     # User registration and login logic
│   ├── patientController.js  # Patient CRUD logic
│   ├── doctorController.js   # Doctor CRUD logic
│   └── mappingController.js  # Patient-Doctor mapping logic
├── routes/
│   ├── authRoutes.js         # /api/auth routes
│   ├── patientRoutes.js      # /api/patients routes
│   ├── doctorRoutes.js       # /api/doctors routes
│   └── mappingRoutes.js      # /api/mappings routes
├── middlewares/
│   └── auth.js               # Bearer JWT verification middleware
├── .env                      # Environment variables
├── .env.example              # Sample environment template
├── .gitignore
├── package.json
└── server.js                 # Entry point
```

---

## ⚙️ Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/healthcare_db"
JWT_SECRET="your_jwt_secret_key"
```

### 3. Start the Server
```bash
# Start in development mode (with auto reload)
npm run dev

# Or start in production mode
npm start
```
The server will automatically connect to PostgreSQL and synchronize all database tables.

---

## 📡 API Endpoints Reference

### 1. Authentication APIs

#### Register User
- **Method**: `POST`
- **URL**: `/api/auth/register`
- **Body**:
```json
{
  "name": "Dr. Sarah Connor",
  "email": "sarah@example.com",
  "password": "password123"
}
```
- **Response**: `201 Created`

#### Login User
- **Method**: `POST`
- **URL**: `/api/auth/login`
- **Body**:
```json
{
  "email": "sarah@example.com",
  "password": "password123"
}
```
- **Response**: `200 OK` (returns JWT `token`)

---

### 2. Patient Management APIs *(Requires `Authorization: Bearer <token>`)*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/patients` | Add a new patient |
| `GET` | `/api/patients` | Get all patients created by the authenticated user |
| `GET` | `/api/patients/:id` | Get details of a specific patient |
| `PUT` | `/api/patients/:id` | Update patient details |
| `DELETE` | `/api/patients/:id` | Delete patient record |

#### Add Patient Sample Body:
```json
{
  "name": "John Doe",
  "age": 35,
  "gender": "Male",
  "contact": "+91-9876543210",
  "address": "221B Baker St",
  "medicalHistory": "Mild asthma"
}
```

---

### 3. Doctor Management APIs

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/doctors` | Yes | Add a new doctor |
| `GET` | `/api/doctors` | No | Get list of all doctors |
| `GET` | `/api/doctors/:id` | No | Get details of a specific doctor |
| `PUT` | `/api/doctors/:id` | Yes | Update doctor details |
| `DELETE` | `/api/doctors/:id` | Yes | Delete doctor record |

#### Add Doctor Sample Body:
```json
{
  "name": "Dr. Gregory House",
  "specialization": "Diagnostic Medicine",
  "email": "house@hospital.com",
  "phone": "+1-555-0199",
  "yearsOfExperience": 15
}
```

---

### 4. Patient-Doctor Mapping APIs *(Requires `Authorization: Bearer <token>`)*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/mappings` | Assign a doctor to a patient (`patientId`, `doctorId`) |
| `GET` | `/api/mappings` | Retrieve all patient-doctor mappings |
| `GET` | `/api/mappings/:patient_id` | Get all doctors assigned to a specific patient |
| `DELETE` | `/api/mappings/:id` | Remove a doctor assignment |

#### Assign Doctor Sample Body:
```json
{
  "patientId": 1,
  "doctorId": 1,
  "notes": "Primary consultant"
}
```
