from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model with full data (for own profile)."""
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'mobile', 'chapter', 'is_superadmin', 'bio', 
            'profile_picture', 'date_joined', 'total_gives'
        ]
        read_only_fields = ['id', 'date_joined', 'total_gives']


class PublicUserSerializer(serializers.ModelSerializer):
    """Serializer for User model with masked data (for public view)."""
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'mobile', 'chapter', 'date_joined', 'total_gives',
            'profile_picture'
        ]
        read_only_fields = ['id', 'date_joined', 'total_gives']


class LeaderboardUserSerializer(serializers.ModelSerializer):
    """Serializer for leaderboard display."""
    give_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'first_name', 'last_name', 
            'chapter', 'give_count'
        ]
        read_only_fields = ['id', 'give_count']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration (admin only)."""
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name', 
            'mobile', 'chapter', 'password', 'password_confirm',
            'profile_picture'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile."""
    
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'email', 'mobile', 'chapter', 'bio', 'profile_picture'
        ]


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include username and password')
        
        return attrs 