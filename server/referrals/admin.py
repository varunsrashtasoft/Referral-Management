from django.contrib import admin
from .models import Give


@admin.register(Give)
class GiveAdmin(admin.ModelAdmin):
    """Admin configuration for Give model."""
    
    list_display = ('id', 'name', 'company', 'state', 'city', 'category', 'email', 'phone', 'is_active', 'created_at')
    list_filter = ('state', 'city', 'category', 'is_active')
    search_fields = ('name', 'company', 'email', 'phone', 'city', 'state')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'name', 'company', 'category', 'state', 'city')
        }),
        ('Contact Information', {
            'fields': ('email', 'phone')
        }),
        ('Additional Details', {
            'fields': ('description', 'website')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user') 