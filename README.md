# 🎬 Movie Ticket Reservation System

A Full-Stack Web Application for Online Movie Booking with Admin Management.

This project is a complete web-based movie ticket reservation system developed as part of my internship at **Vanier College**.

---

## 🚀 Features

### 👤 User Features
- User Registration & Login (JWT Authentication)
- Browse movies and showtimes
- Select seats (cinema-style layout)
- Create and cancel reservations
- View personal reservation history

### 🛠️ Admin Features
- Manage movies (CRUD)
- Manage showtimes
- View all reservations
- See which user made each reservation

### 🔐 Security
- JWT Authentication
- Role-based access control (USER / ADMIN)
- Protected routes (frontend + backend)

### 🐳 Docker
- Docker environment prepared
- docker-compose configuration included
- Backend + database containerized (frontend in progress)

---

## 🏗️ Architecture

Frontend → Backend → Database

React (Vite) → Spring Boot → PostgreSQL

---

## 🧰 Technologies

### Frontend
- React (Vite)
- Axios
- CSS

### Backend
- Spring Boot
- Spring Security
- JWT Authentication
- JPA / Hibernate

### Database
- PostgreSQL

### Dev Tools
- Docker / Docker Compose
- Postman
- IntelliJ IDEA

---

## 📁 Project Structure

```text
movie-ticket-reservation-system/

├── movie-ticket-system/      # Backend (Spring Boot)
├── movie-ticket-frontend/    # Frontend (React)
├── movie-ticket-docker/      # Docker configuration
└── .gitignore
```

---

## ▶ How to Run

### Option 1: Run Locally 

#### 🔹 Backend
- Open project in IntelliJ
- Run Spring Boot application

Runs on:
http://localhost:7070

#### 🔹 Frontend
cd movie-ticket-frontend
npm install
npm run dev

Runs on:
http://localhost:5173

---

### Option 2: Run with Docker 

docker compose up --build

---

## 🧪 Testing

- API testing with Postman
- Authentication and authorization verified
- Reservation logic tested (including duplicate seat prevention)

---

## 📌 API Example

GET /api/movies

POST /api/auth/login

---

## 👨‍🎓 Author

**Xiaobo Zhan**  
Software Development Attestation – Secure Desktop, Mobile and Web Applications  
Vanier College, Montreal
