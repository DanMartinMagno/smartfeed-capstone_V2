# SMARTFEED: ANDROID-BASED ALTERNATIVE FEEDFORMULATION FOR NATIVE SWINE NUTRITION

## Overview

SmartFeed was developed to assist swine raisers in Lupi, Camarines Sur, by providing a mobile-based solution for sustainable feeding practices and improving livestock productivity. The application combines feed formulation capabilities with weight tracking features to provide an all-in-one solution for swine management.

## 🚀 Download APK

[Download the latest SmartFeed APK](https://github.com/DanMartinMagno/smartfeed-capstone_V2/releases/download/v2.0.0/SmartFeed.apk)

## 📸 Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/8b05d161-6255-4223-b97d-d411a14be657" alt="App Screenshot" width="200"/>
  <img src="https://github.com/user-attachments/assets/c3582fd6-e9f5-4154-ba5a-c791adf27a10" alt="App Screenshot" width="200"/>
  <img src="https://github.com/user-attachments/assets/95d8213c-f46c-4415-a939-c5adbccbca24" alt="App Screenshot" width="200"/>
  <img src="https://github.com/user-attachments/assets/6c75a68a-f432-4fa8-84f4-7e3216a108c8" alt="App Screenshot" width="200"/>
  <img src="https://github.com/user-attachments/assets/785160c7-d9d1-459c-8a06-45548005d93f" alt="App Screenshot" width="200"/>
  <img src="https://github.com/user-attachments/assets/09ca45dc-72d1-45bb-8bf4-726114993e16" alt="App Screenshot" width="200"/>
</p>

---

## Features

- **Feed Formulation**

  - Custom feed formulation based on swine growth stage
    Starter (14–28 days)
    Grower (29–84 days)
    Finisher (85 days and beyond)

- **Nutrient analysis**

  - Nutrient analysis and optimization
  - Cost-effective ingredient combinations
  - Save and manage formulations

- **Swine Management**

  - Track individual swine growth
  - Weight monitoring and benchmarking
  - Growth performance analytics
  - Historical data visualization

  - **FAQ Section**
  - Common questions about swine raising answered in one place.

- **User Management**
  - Secure authentication system
  - User profile management
  - Password recovery
  - Data persistence

## Tech Stack

### Frontend

- React Native with Expo
- TypeScript
- React Navigation
- Context API for state management
- Axios for API communication

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT Authentication

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB
- Expo CLI

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/DanMartinMagno/smartfeed-capstone_V2.git
   cd smartfeed-capstone_V2
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables:
   - Backend (.env):
     ```
     MONGO_URI=your_mongodb_connection_string
     PORT=4000
     JWT_SECRET=your_jwt_secret
     ```
   - Frontend (.env):
     ```
     EXPO_PUBLIC_API_URL=your_backend_api_url
     ```

## Running the Application

1. Start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend application:

   ```bash
   cd frontend
   npx expo start
   ```

3. Use the Expo Go app on your mobile device to scan the QR code, or run on an emulator.

## Project Structure

```
smartfeed/
├── backend/
│   ├── controllers/     # Request handlers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── middleware/     # Custom middleware
│   └── utils/          # Utility functions
│
└── frontend/
    ├── api/           # API integration
    ├── components/    # Reusable components
    ├── context/       # React Context
    ├── navigation/    # Navigation setup
    ├── screens/       # Application screens
    └── styles/        # Styling files
```

## API Documentation

The backend API provides the following main endpoints:

- Authentication:

  - POST /api/auth/login
  - POST /api/auth/register
  - POST /api/auth/change-password

- Swine Management:

  - GET /api/swine
  - POST /api/swine
  - PUT /api/swine/:id
  - DELETE /api/swine/:id

- Feed Formulation:
  - POST /api/formulation
  - GET /api/formulation
  - GET /api/formulation/:id

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Dan Martin Magno

- [GitHub](https://github.com/DanMartinMagno)
- [LinkedIn](https://www.linkedin.com/in/danmartinmagno)

Project Link: [https://github.com/DanMartinMagno/smartfeed-capstone_V2](https://github.com/DanMartinMagno/smartfeed-capstone_V2)
