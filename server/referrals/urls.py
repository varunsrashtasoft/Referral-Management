from django.urls import path
from . import views

urlpatterns = [
    # Public Gives (masked data)
    path('gives/', views.GiveListView.as_view(), name='give-list'),
    
    # My Gives (full data)
    path('gives/my/', views.MyGivesListView.as_view(), name='my-gives'),
    
    # Individual Give operations
    path('gives/<int:pk>/', views.GiveDetailView.as_view(), name='give-detail'),
    path('gives/<int:give_id>/contact/', views.give_contact_info, name='give-contact-info'),
    path('gives/<int:give_id>/toggle/', views.toggle_give_status, name='toggle-give-status'),
    
    # Admin only - All Gives
    path('gives/all/', views.AllGivesListView.as_view(), name='all-gives'),
    
    # Statistics
    path('gives/stats/', views.gives_stats, name='gives-stats'),
] 