from rest_framework import status, generics, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Count
from datetime import datetime, timedelta
from django_filters.rest_framework import DjangoFilterBackend

from .models import User
from .serializers import (
    UserSerializer, PublicUserSerializer, LeaderboardUserSerializer,
    UserRegistrationSerializer, UserUpdateSerializer, LoginSerializer
)
from .permissions import IsSuperAdmin, IsOwnerOrSuperAdmin


class LoginView(generics.GenericAPIView):
    """User login view."""
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        })


class UserRegistrationView(generics.CreateAPIView):
    """User registration view (admin only)."""
    permission_classes = [IsSuperAdmin]
    serializer_class = UserRegistrationSerializer
    queryset = User.objects.all()


class UserListView(generics.ListAPIView):
    """List all users (admin only)."""
    permission_classes = [IsSuperAdmin]
    serializer_class = PublicUserSerializer
    queryset = User.objects.all().order_by('-date_joined')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    filterset_fields = ['chapter']


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """User detail view."""
    permission_classes = [IsOwnerOrSuperAdmin]
    serializer_class = UserSerializer
    queryset = User.objects.all()
    
    def get_serializer_class(self):
        if self.request.user.is_superadmin:
            return UserSerializer
        return PublicUserSerializer


class ProfileView(generics.RetrieveUpdateAPIView):
    """Current user's profile view."""
    permission_classes = [IsAuthenticated]
    serializer_class = UserUpdateSerializer
    
    def get_object(self):
        return self.request.user
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserSerializer
        return UserUpdateSerializer


class LeaderboardView(generics.ListAPIView):
    """Leaderboard view showing top contributors."""
    permission_classes = [IsAuthenticated]
    serializer_class = LeaderboardUserSerializer
    
    def get_queryset(self):
        period = self.request.query_params.get('period', 'all')
        
        if period == 'lastweek':
            # Get users with most gives in the last week
            last_week = datetime.now() - timedelta(days=7)
            return User.objects.filter(
                gives__created_at__gte=last_week
            ).annotate(
                give_count=Count('gives')
            ).filter(
                give_count__gt=0
            ).order_by('-give_count')[:10]
        else:
            # Get all-time top contributors
            return User.objects.annotate(
                give_count=Count('gives')
            ).filter(
                give_count__gt=0
            ).order_by('-give_count')[:10]


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """User logout view."""
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({'message': 'Successfully logged out'})
    except Exception as e:
        return Response(
            {'error': 'Invalid token'}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats_view(request):
    """Get current user's statistics."""
    user = request.user
    
    # Get last week's gives
    last_week = datetime.now() - timedelta(days=7)
    last_week_gives = user.gives.filter(created_at__gte=last_week).count()
    
    # Get total gives
    total_gives = user.total_gives
    
    return Response({
        'total_gives': total_gives,
        'last_week_gives': last_week_gives,
        'rank': User.objects.annotate(
            total_gives=Count('gives')
        ).filter(
            total_gives__gt=total_gives
        ).count() + 1 if total_gives > 0 else 0
    }) 