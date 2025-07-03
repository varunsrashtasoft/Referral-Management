from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom User model for Give Bank platform."""
    
    # Extended fields
    mobile = models.CharField(max_length=15, blank=True, null=True)
    chapter = models.CharField(max_length=100, blank=True, null=True)
    is_superadmin = models.BooleanField(default=False)
    
    # Profile fields
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)  # Disabled due to Pillow dependency
    bio = models.TextField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return self.username
    
    @property
    def full_name(self):
        """Return the user's full name."""
        return f"{self.first_name} {self.last_name}".strip()
    
    @property
    def total_gives(self):
        """Return the total number of gives by this user."""
        return self.gives.count()
    
    @property
    def masked_mobile(self):
        """Return masked mobile number for privacy."""
        if self.mobile and len(self.mobile) >= 4:
            return f"***-***-{self.mobile[-4:]}"
        return "***-***-****"
    
    @property
    def masked_email(self):
        """Return masked email for privacy."""
        if self.email:
            username, domain = self.email.split('@')
            if len(username) <= 2:
                masked_username = username
            else:
                masked_username = username[0] + '*' * (len(username) - 2) + username[-1]
            return f"{masked_username}@{domain}"
        return "***@***.com" 