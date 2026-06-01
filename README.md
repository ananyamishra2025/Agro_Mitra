# 🌱 Agro-Mitra

## Smart Agriculture Assistance Platform

Agro-Mitra is an AI-powered agriculture assistance platform designed to help farmers, gardeners, and students make informed agricultural decisions through crop advisory, AI chatbot support, image-based disease detection, voice assistance, learning resources, and activity tracking.

The platform combines modern web technologies, artificial intelligence, and agricultural knowledge into a single user-friendly dashboard.

---

## 📖 Project Overview

Agriculture is one of the most important sectors of the economy, yet many farmers lack timely access to expert guidance regarding crops, fertilizers, diseases, irrigation, weather conditions, and agricultural practices.

Agro-Mitra aims to bridge this gap by providing a centralized digital platform that offers intelligent recommendations, educational resources, and AI-powered assistance for everyday farming decisions.

---

## ✨ Features

### 🌾 Crop Advisory
- Personalized crop recommendations
- Fertilizer suggestions
- Irrigation guidance
- Action plans based on farm details

### 🤖 AI Chatbot
- Agriculture-focused conversational assistant
- Answers questions about crops, soil, fertilizers, diseases, and farming practices
- AI-powered responses with agricultural knowledge support

### 🎤 Voice Assistant
- Voice-based agricultural queries
- Speech-to-text processing
- Multilingual support capability

### 📷 Image Disease Detection
- Upload crop images
- Detect visible plant diseases
- Receive treatment recommendations

### 📊 Dashboard Analytics
- Total queries tracking
- Crop analysis statistics
- Disease detection activity
- Advisory usage overview
- Recent activity monitoring

### 📚 Learning Resources
- ICAR resources
- Soil health management guides
- Organic farming materials
- Modern agriculture techniques

### 🪴 Gardening Support
- Home gardening guides
- Balcony gardening tips
- Plant care recommendations

### 📝 History Tracking
- Crop advisory history
- Chat history
- Disease detection history
- Voice query history

### 📞 Contact & Support
- User enquiry submission
- Support request management

### 🚀 Future Scope Section
Planned enhancements:
- Market Price Prediction
- Weather Forecasting
- Community Forum
- Government Scheme Finder
- Advanced AI Recommendations

---

## 🏗️ System Architecture

```text
Frontend (React + Vite)
          │
          ▼
Backend (Node.js + Express)
          │
          ▼
MongoDB Atlas Database
          │
          ▼
AI & External Services
 ├── Groq API
 ├── OpenWeather API
 └── Google Speech Services
```

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- Mongoose

### APIs & AI Services
- Groq API
- OpenWeather API
- Google Cloud Speech Services

### Security
- JWT Authentication
- bcrypt Password Hashing
- Helmet
- Express Rate Limiting
- Input Validation

### Testing
- Node.js Test Runner
- Automated Backend Testing

---

## 📂 Project Structure

```text
AGRO_MITRA
│
├── frontend
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── middlewares
│   │   ├── modules
│   │   ├── utils
│   │   ├── app.js
│   │   ├── routes.js
│   │   └── server.js
│   │
│   ├── uploads
│   ├── test
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│
├── README.md
└── .gitignore
```

---

## 🔌 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/change-password
POST /api/auth/reset-password
```

### Crop Advisory

```http
POST /api/advisory/recommend
```

### Chatbot

```http
POST /api/chatbot/ask
```

### Voice Assistant

```http
POST /api/voice/ask
```

### Image Detection

```http
POST /api/upload/image
```

### History

```http
GET /api/history/:userId
```

### Dashboard

```http
GET /api/dashboard/overview
```

### Learning Resources

```http
GET /api/learning/resources
GET /api/learning/gardening
```

### Contact

```http
POST /api/contact
GET /api/contact
```

### Settings

```http
GET /api/settings
PUT /api/settings
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/agro-mitra.git
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
GROQ_API_KEY=your_groq_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
GOOGLE_APPLICATION_CREDENTIALS=src/config/google-key.json
JWT_SECRET=your_jwt_secret
```

Start Backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Testing

Run backend tests:

```bash
npm test
```

Current automated test coverage includes:

- Health Check
- Authentication
- Password Management
- Dashboard
- Contact Module
- Settings Module
- Chatbot
- History Module
- Database Models
- Crop Classification
- Recommendation Engine
- Disease Detection
- Security Middleware

---

## 🔒 Security Features

- JWT Authentication
- Password Hashing (bcrypt)
- Helmet Security Middleware
- API Rate Limiting
- Environment Variable Protection
- Request Validation
- Secure MongoDB Integration

---

## 📈 Project Status

| Module | Status |
|----------|---------|
| Frontend | ✅ Complete |
| Backend | ✅ Complete |
| Database Integration | ✅ Complete |
| Security | ✅ Complete |
| Testing | ✅ Complete |
| Deployment | 🔄 Ready |

---

## 🌍 Future Enhancements

- Advanced Deep Learning Disease Detection
- Market Price Prediction
- Regional Language Support
- Farmer Community Platform
- Government Scheme Recommendation Engine
- Weather Forecast Dashboard
- Mobile Application
- IoT-Based Smart Farming Integration

---

## 👨‍💻 Developer

**Ananya Mishra**  
B.Tech – Computer Science and Business Systems

### Project Title

**Agro-Mitra: Smart Agriculture Assistance Platform**

---

## 📄 License

This project is developed for educational, research, and agricultural assistance purposes.

© 2026 Agro-Mitra. All Rights Reserved.
