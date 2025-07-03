from django.db import models
from django.conf import settings


class Give(models.Model):
    """Model for managing referrals (Gives) in the Give Bank platform."""
    
    CATEGORY_CHOICES = [
        ("advertising_marketing", "Advertising & Marketing"),
        ("agriculture", "Agriculture"),
        ("animals", "Animals"),
        ("architecture_engineering", "Architecture & Engineering"),
        ("art_entertainment", "Art & Entertainment"),
        ("car_motorcycle", "Car & Motorcycle"),
        ("computer_programming", "Computer & Programming"),
        ("construction", "Construction"),
        ("consulting", "Consulting"),
        ("employment_activities", "Employment Activities"),
        ("event_business_service", "Event & Business Service"),
        ("finance_insurance", "Finance & Insurance"),
        ("food_beverage", "Food & Beverage"),
        ("health_wellness", "Health & Wellness"),
        ("legal_accounting", "Legal & Accounting"),
        ("manufacturing", "Manufacturing"),
        ("organizations_others", "Organizations & Others"),
        ("personal_services", "Personal Services"),
        ("real_estate_services", "Real Estate Services"),
        ("repair", "Repair"),
        ("retail", "Retail"),
        ("security_investigation", "Security & Investigation"),
        ("sports_leisure", "Sports & Leisure"),
        ("telecommunications", "Telecommunications"),
        ("training_coaching", "Training & Coaching"),
        ("transport_shipping", "Transport & Shipping"),
        ("travel", "Travel"),
        ("other", "Other"),
        ("auto_tech_startup", "Auto Tech Startup"),
    ]
    STATE_CHOICES = [
        ("Andaman and Nicobar Islands - AN", "Andaman and Nicobar Islands - AN"),
        ("Andhra Pradesh - AP", "Andhra Pradesh - AP"),
        ("Arunachal Pradesh - AR", "Arunachal Pradesh - AR"),
        ("Assam - AS", "Assam - AS"),
        ("Bihar - BR", "Bihar - BR"),
        ("Chandigarh - CH", "Chandigarh - CH"),
        ("Chhattisgarh - CT", "Chhattisgarh - CT"),
        ("Dadra and Nagar Haveli and Daman and Diu - DH", "Dadra and Nagar Haveli and Daman and Diu - DH"),
        ("Delhi - DL", "Delhi - DL"),
        ("Goa - GA", "Goa - GA"),
        ("Gujarat - GJ", "Gujarat - GJ"),
        ("Haryana - HR", "Haryana - HR"),
        ("Himachal Pradesh - HP", "Himachal Pradesh - HP"),
        ("Jammu and Kashmir - JK", "Jammu and Kashmir - JK"),
        ("Jharkhand - JH", "Jharkhand - JH"),
        ("Karnataka - KA", "Karnataka - KA"),
        ("Kerala - KL", "Kerala - KL"),
        ("Ladakh - LA", "Ladakh - LA"),
        ("Lakshadweep - LD", "Lakshadweep - LD"),
        ("Madhya Pradesh - MP", "Madhya Pradesh - MP"),
        ("Maharashtra - MH", "Maharashtra - MH"),
        ("Manipur - MN", "Manipur - MN"),
        ("Meghalaya - ML", "Meghalaya - ML"),
        ("Mizoram - MZ", "Mizoram - MZ"),
        ("Nagaland - NL", "Nagaland - NL"),
        ("Odisha - OR", "Odisha - OR"),
        ("Puducherry - PY", "Puducherry - PY"),
        ("Punjab - PB", "Punjab - PB"),
        ("Rajasthan - RJ", "Rajasthan - RJ"),
        ("Sikkim - SK", "Sikkim - SK"),
        ("Tamil Nadu - TN", "Tamil Nadu - TN"),
        ("Telangana - TG", "Telangana - TG"),
        ("Tripura - TR", "Tripura - TR"),
        ("Uttar Pradesh - UP", "Uttar Pradesh - UP"),
        ("Uttarakhand - UT", "Uttarakhand - UT"),
        ("West Bengal - WB", "West Bengal - WB"),
    ]
    
    # Basic information
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='gives'
    )
    name = models.CharField(max_length=100)
    company = models.CharField(max_length=100, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    state = models.CharField(max_length=50, choices=STATE_CHOICES, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    
    # Contact information
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    
    # Additional details
    description = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Give'
        verbose_name_plural = 'Gives'
    
    def __str__(self):
        return f"{self.name} - {self.company}"
    
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
    
    @property
    def masked_phone(self):
        """Return masked phone number for privacy."""
        if self.phone and len(self.phone) >= 4:
            return f"***-***-{self.phone[-4:]}"
        return "***-***-****"
    
    @property
    def creator_contact_info(self):
        """Return creator's contact information for contact buttons."""
        return {
            'mobile': self.user.mobile,
            'whatsapp': self.user.mobile,  # Assuming mobile can be used for WhatsApp
            'email': self.user.email
        } 