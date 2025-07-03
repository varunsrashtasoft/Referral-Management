from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for User model."""
    
    list_display = [
        'username', 'email', 'first_name', 'last_name',
        'chapter', 'is_superadmin', 'is_active', 'date_joined'
    ]
    list_filter = [
        'is_superadmin', 'is_active', 'is_staff', 
        'chapter', 'date_joined'
    ]
    search_fields = ['username', 'email', 'first_name', 'last_name', 'chapter']
    ordering = ['-date_joined']
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {
            'fields': ('first_name', 'last_name', 'email', 'mobile', 'chapter', 'bio', 'profile_picture')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'is_superadmin', 'groups', 'user_permissions'),
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'first_name', 'last_name', 'mobile', 'chapter'),
        }),
    )
    
    readonly_fields = ['date_joined', 'last_login'] 