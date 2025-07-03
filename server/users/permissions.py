from rest_framework import permissions


class IsSuperAdmin(permissions.BasePermission):
    """Permission to check if user is a super admin."""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_superadmin


class IsOwnerOrSuperAdmin(permissions.BasePermission):
    """Permission to check if user is the owner or a super admin."""
    
    def has_object_permission(self, request, view, obj):
        # Super admin can access everything
        if request.user.is_superadmin:
            return True
        
        # Check if the object has a user field
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        # For user objects, check if it's the same user
        if hasattr(obj, 'id'):
            return obj.id == request.user.id
        
        return False


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Permission to allow read access to all users, but write access only to owners."""
    
    def has_object_permission(self, request, view, obj):
        # Read permissions for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Super admin can do everything
        if request.user.is_superadmin:
            return True
        
        # Write permissions only to the owner
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        return False 