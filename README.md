# FitAI - Full-Stack Fitness Platform

A production-ready full-stack fitness website with AI-powered personalized workout and diet plans.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express, MongoDB, JWT Authentication
- **ML Service:** Python, Flask, Scikit-learn (Heuristic/Simple Model)

## Prerequisites

- Node.js (v18+)
- Python (v3.8+)
- MongoDB (Local or Atlas URI)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd fitness-website
```

### 2. Backend Setup
```bash
cd server
npm install
# Create a .env file with:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/fitness_app
# JWT_SECRET=your_secret_key
npm run dev
```
The server will start on `http://localhost:5000`.

### 3. ML Service Setup
```bash
cd ml_service
pip install -r requirements.txt
python app.py
```
The ML service will start on `http://localhost:5001`.

### 4. Frontend Setup
```bash
cd client
npm install
npm run dev
```
The frontend will start on `http://localhost:3000`.

## Features

- **User Authentication:** Secure Signup/Login with JWT.
- **Dashboard:** View profile stats and generated plans.
- **AI Plan Generator:** Generates personalized workout and diet plans based on user data.
- **Responsive Design:** Modern UI with dark mode and smooth animations.

## Deployment

- **Frontend:** Deploy to Vercel or Netlify.
- **Backend:** Deploy to Render, Heroku, or AWS.
- **ML Service:** Deploy to Render, Heroku, or AWS (Python environment).
- **Database:** Use MongoDB Atlas.

## API Endpoints

- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/user/profile` - Get user profile
- `POST /api/plan/generate` - Generate fitness plan
- `GET /api/plan` - Get current plan
