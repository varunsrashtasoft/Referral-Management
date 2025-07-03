from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.logout_view, name='logout'),
    
    # User management (admin only)
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    
    # Profile and stats
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('stats/', views.user_stats_view, name='user-stats'),
    
    # Leaderboard
    path('leaderboard/', views.LeaderboardView.as_view(), name='leaderboard'),
] 