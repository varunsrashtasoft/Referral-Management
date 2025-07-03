#!/usr/bin/env python3
"""
Setup script for Give Bank Referral Management Platform
"""

import os
import sys
import subprocess
import json

def run_command(command, cwd=None):
    """Run a command and return the result"""
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, capture_output=True, text=True)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def setup_backend():
    """Setup Django backend"""
    print("🚀 Setting up Django backend...")
    
    # Change to server directory
    os.chdir("server")
    
    # Create virtual environment
    print("📦 Creating virtual environment...")
    success, stdout, stderr = run_command("python -m venv venv")
    if not success:
        print(f"❌ Failed to create virtual environment: {stderr}")
        return False
    
    # Activate virtual environment and install dependencies
    if os.name == 'nt':  # Windows
        pip_cmd = "venv\\Scripts\\pip"
        python_cmd = "venv\\Scripts\\python"
    else:  # Unix/Linux/Mac
        pip_cmd = "venv/bin/pip"
        python_cmd = "venv/bin/python"
    
    print("📥 Installing Python dependencies...")
    success, stdout, stderr = run_command(f"{pip_cmd} install -r requirements.txt")
    if not success:
        print(f"❌ Failed to install dependencies: {stderr}")
        return False
    
    # Run migrations
    print("🗄️ Running database migrations...")
    success, stdout, stderr = run_command(f"{python_cmd} manage.py makemigrations")
    if not success:
        print(f"❌ Failed to create migrations: {stderr}")
        return False
    
    success, stdout, stderr = run_command(f"{python_cmd} manage.py migrate")
    if not success:
        print(f"❌ Failed to run migrations: {stderr}")
        return False
    
    print("✅ Backend setup completed!")
    return True

def setup_frontend():
    """Setup React frontend"""
    print("🎨 Setting up React frontend...")
    
    # Change to client directory
    os.chdir("client")
    
    # Install dependencies
    print("📥 Installing Node.js dependencies...")
    success, stdout, stderr = run_command("npm install")
    if not success:
        print(f"❌ Failed to install dependencies: {stderr}")
        return False
    
    print("✅ Frontend setup completed!")
    return True

def create_superuser():
    """Create a superuser for the platform"""
    print("👤 Creating superuser...")
    
    os.chdir("server")
    
    if os.name == 'nt':  # Windows
        python_cmd = "venv\\Scripts\\python"
    else:  # Unix/Linux/Mac
        python_cmd = "venv/bin/python"
    
    print("Please enter the following information for the superuser:")
    username = input("Username: ")
    email = input("Email: ")
    first_name = input("First Name: ")
    last_name = input("Last Name: ")
    
    # Create superuser using Django management command
    command = f"{python_cmd} manage.py shell -c \"from django.contrib.auth import get_user_model; User = get_user_model(); user = User.objects.create_superuser('{username}', '{email}', 'admin123'); user.first_name = '{first_name}'; user.last_name = '{last_name}'; user.is_superadmin = True; user.save(); print(f'Superuser {username} created successfully!')\""
    
    success, stdout, stderr = run_command(command)
    if success:
        print("✅ Superuser created successfully!")
        print(f"Username: {username}")
        print("Password: admin123")
        print("⚠️  Please change the password after first login!")
    else:
        print(f"❌ Failed to create superuser: {stderr}")

def main():
    """Main setup function"""
    print("🎯 Give Bank - Referral Management Platform Setup")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists("server") or not os.path.exists("client"):
        print("❌ Please run this script from the project root directory")
        sys.exit(1)
    
    # Setup backend
    if not setup_backend():
        print("❌ Backend setup failed!")
        sys.exit(1)
    
    # Setup frontend
    if not setup_frontend():
        print("❌ Frontend setup failed!")
        sys.exit(1)
    
    # Create superuser
    create_superuser()
    
    print("\n🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Start the backend server:")
    print("   cd server")
    print("   venv\\Scripts\\python manage.py runserver  # Windows")
    print("   venv/bin/python manage.py runserver       # Unix/Linux/Mac")
    print("\n2. Start the frontend development server:")
    print("   cd client")
    print("   npm run dev")
    print("\n3. Open your browser and navigate to:")
    print("   http://localhost:3000")
    print("\n4. Login with the superuser credentials created above")

if __name__ == "__main__":
    main() 