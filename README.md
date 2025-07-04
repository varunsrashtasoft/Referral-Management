# 📘 Give Bank - Referral Management Platform

A comprehensive referral management platform designed for members to record, share, and track business referrals within a professional network or group.

## 🚀 Features

### ✅ General Features
- User registration & login (admin-controlled)
- Dashboard with leaderboard (top 10 contributors)
- Add/Edit/Delete/View personal referrals (My Gives)
- View public referrals with masked contact info (All Gives)
- Filter referrals by category
- Profile management

### ✅ Super Admin Features
- Full user management (CRUD)
- Access to all user data and activity
- Can view and manage all Gives

### ✅ Regular User Features
- Create/manage own referrals (Gives)
- View others' referrals with masked info
- Contact the creator of a Give via phone/WhatsApp
- Update their own profile

## 🛠 Technology Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Django REST Framework
- **Database**: PostgreSQL (production), SQLite (development)
- **Authentication**: JWT
- **Deployment**: Vercel (frontend), Render/Railway (backend)

## 📁 Project Structure

```
├── client/                 # React Frontend
│   ├── public/
│   │   └── ...
│   └── package.json
│
├── server/                 # Django Backend
│   ├── givebank/           # Main Django project
│   ├── users/              # User management app
│   ├── referrals/          # Referral management app
│   ├── requirements.txt
│   └── manage.py
│
└── README.md
```

## 🚀 Quick Start

### Backend Setup
```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

## 🔐 Security Features

- JWT Authentication
- Rate limiting
- CORS protection
- Masked contact information
- Role-based access control

## 📱 Main Screens

1. **Login/Register** - Admin-controlled user access
2. **Dashboard** - Leaderboard and statistics
3. **All Gives** - Public referrals with masked info
4. **My Gives** - User's own referrals
5. **Profile** - User profile management

---

**Developed with ❤️ using React + Django** 


when push code to github for server then change 
authService.js file's API_BASE_URL to VITE_API_URL=http://192.168.0.111:8000
