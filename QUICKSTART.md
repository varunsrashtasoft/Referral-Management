# 🚀 Give Bank - Quick Start Guide

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## 🎯 Quick Setup

### Option 1: Automated Setup (Recommended)

Run the setup script from the project root:

```bash
python setup.py
```

This will:
- Create virtual environment
- Install all dependencies
- Run database migrations
- Create a superuser account
- Set up the frontend

### Option 2: Manual Setup

#### Backend Setup

```bash
cd server

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Unix/Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

#### Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔐 Initial Login

1. Open your browser and go to `http://localhost:3000`
2. Login with the superuser credentials created during setup
3. Default password is `admin123` (change it after first login!)

## 📱 Platform Features

### For Regular Users:
- **Dashboard**: View your statistics and leaderboard
- **All Gives**: Browse all referrals with masked contact info
- **My Gives**: Manage your own referrals (create, edit, delete)
- **Profile**: Update your personal information

### For Super Admins:
- All regular user features
- **User Management**: Create and manage user accounts
- **Full Access**: View all data without masking

## 🛠 Development

### Backend API Endpoints

- `POST /api/login/` - User login
- `GET /api/gives/` - Get all public gives (masked)
- `GET /api/gives/my/` - Get user's own gives
- `POST /api/gives/my/` - Create new give
- `PUT /api/gives/<id>/` - Update give
- `DELETE /api/gives/<id>/` - Delete give
- `GET /api/leaderboard/` - Get leaderboard
- `GET /api/profile/` - Get user profile

### Frontend Structure

```
client/src/
├── components/     # Reusable UI components
├── pages/         # Main application pages
├── services/      # API service functions
├── context/       # React context providers
└── utils/         # Utility functions
```

## 🔧 Configuration

### Environment Variables

Create `.env` files in both `server/` and `client/` directories:

**server/.env:**
```
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///db.sqlite3
```

**client/.env:**
```
VITE_API_URL=http://localhost:8000/api
```

## 🚀 Deployment

### Backend Deployment (Render/Railway)

1. Connect your repository
2. Set environment variables
3. Build command: `pip install -r requirements.txt`
4. Start command: `gunicorn givebank.wsgi:application`

### Frontend Deployment (Vercel/Netlify)

1. Connect your repository
2. Build command: `npm run build`
3. Output directory: `dist`

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**: Change ports in `vite.config.js` or Django settings
2. **CORS errors**: Check CORS settings in `settings.py`
3. **Database errors**: Run `python manage.py migrate`
4. **Node modules issues**: Delete `node_modules` and run `npm install`

### Getting Help

- Check the Django logs in the terminal
- Check browser console for frontend errors
- Verify all dependencies are installed correctly

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Happy coding! 🎉** 