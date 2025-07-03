from rest_framework import serializers
from .models import Give
from users.serializers import PublicUserSerializer


class GiveSerializer(serializers.ModelSerializer):
    """Serializer for Give model with full data (for owner)."""
    user = PublicUserSerializer(read_only=True)
    
    class Meta:
        model = Give
        fields = [
            'id', 'user', 'name', 'company', 'department', 'category', 'state', 'city',
            'email', 'phone', 'description', 'website', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class PublicGiveSerializer(serializers.ModelSerializer):
    """Serializer for Give model with masked data (for public view)."""
    user = PublicUserSerializer(read_only=True)
    email = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    
    class Meta:
        model = Give
        fields = [
            'id', 'user', 'name', 'company', 'department', 'category', 'state', 'city',
            'email', 'phone', 'description', 'website', 'is_active',
            'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']
    
    def get_email(self, obj):
        return obj.masked_email
    
    def get_phone(self, obj):
        return obj.masked_phone


class GiveCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new Give."""
    
    class Meta:
        model = Give
        fields = [
            'name', 'company', 'department', 'category', 'state', 'city',
            'email', 'phone', 'description', 'website'
        ]
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class GiveUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating a Give."""
    
    class Meta:
        model = Give
        fields = [
            'name', 'company', 'department', 'category', 'state', 'city',
            'email', 'phone', 'description', 'website', 'is_active'
        ]


class ContactInfoSerializer(serializers.Serializer):
    """Serializer for contact information of Give creator."""
    mobile = serializers.CharField()
    whatsapp = serializers.CharField()
    email = serializers.EmailField()
    
    def to_representation(self, instance):
        # Mask the contact information
        mobile = instance.get('mobile', '')
        email = instance.get('email', '')
        
        if mobile and len(mobile) >= 4:
            masked_mobile = f"***-***-{mobile[-4:]}"
        else:
            masked_mobile = "***-***-****"
        
        if email:
            username, domain = email.split('@')
            if len(username) <= 2:
                masked_username = username
            else:
                masked_username = username[0] + '*' * (len(username) - 2) + username[-1]
            masked_email = f"{masked_username}@{domain}"
        else:
            masked_email = "***@***.com"
        
        return {
            'mobile': masked_mobile,
            'whatsapp': masked_mobile,  # Same as mobile for consistency
            'email': masked_email
        } 