# GameVault - Full Stack Gaming Store

A modern e-commerce platform for games, built with **Django REST Framework** and **React**.

## 🚀 Tech Stack

### Backend
- **Framework**: Django REST Framework (DRF)
- **Authentication**: JWT (SimpleJWT)
- **Database**: SQLite (Development)
- **Package Manager**: `uv`

### Frontend
- **Framework**: React + Vite
- **UI Library**: Material UI (MUI)
- **State Management**: React Context API
- **API Client**: Native Fetch API

## 🛠️ Features
- **Custom User System**: Email-based authentication.
- **Game Browsing**: Search and filter through the game collection.
- **Cart System**: Fully functional shopping cart synced with the backend.
- **Favorites**: Personal list of favorite games.
- **Admin Dashboard**: Manage games, users, and orders via Django Admin.

## 📦 Getting Started

### Backend Setup
1. Navigate to `/backend`
2. Install dependencies: `uv sync`
3. Run migrations: `uv run python manage.py migrate`
4. Start server: `uv run python manage.py runserver`

### Frontend Setup
1. Navigate to `/frontend`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`

---
*This project was recently migrated from Supabase to a custom Django backend for better scalability and control.*
