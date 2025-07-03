from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Give
from .serializers import (
    GiveSerializer, PublicGiveSerializer, GiveCreateSerializer,
    GiveUpdateSerializer, ContactInfoSerializer
)
from users.permissions import IsOwnerOrSuperAdmin, IsOwnerOrReadOnly


class GiveListView(generics.ListAPIView):
    """List all public Gives with filtering and search."""
    permission_classes = [IsAuthenticated]
    serializer_class = PublicGiveSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'state', 'city', 'is_active']
    search_fields = ['name', 'company', 'description']
    ordering_fields = ['created_at', 'name', 'company']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Give.objects.filter(is_active=True)


class MyGivesListView(generics.ListCreateAPIView):
    """List and create user's own Gives."""
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'state', 'city', 'is_active']
    search_fields = ['name', 'company', 'description']
    ordering_fields = ['created_at', 'name', 'company']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Give.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return GiveCreateSerializer
        return GiveSerializer


class GiveDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, and delete a specific Give."""
    permission_classes = [IsOwnerOrSuperAdmin]
    queryset = Give.objects.all()
    
    def get_serializer_class(self):
        if self.request.user.is_superadmin or self.get_object().user == self.request.user:
            return GiveSerializer
        return PublicGiveSerializer


class AllGivesListView(generics.ListAPIView):
    """List all Gives (admin only)."""
    permission_classes = [IsAuthenticated]
    serializer_class = GiveSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'state', 'city', 'is_active', 'user']
    search_fields = ['name', 'company', 'description']
    ordering_fields = ['created_at', 'name', 'company']
    ordering = ['-created_at']
    
    def get_queryset(self):
        if self.request.user.is_superadmin:
            return Give.objects.all()
        return Give.objects.none()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def give_contact_info(request, give_id):
    """Get contact information for a Give's creator."""
    try:
        give = Give.objects.get(id=give_id, is_active=True)
        
        # Only allow access if user is the creator or super admin
        if give.user != request.user and not request.user.is_superadmin:
            return Response(
                {'error': 'You can only view contact info for your own Gives'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        contact_info = give.creator_contact_info
        serializer = ContactInfoSerializer(contact_info)
        return Response(serializer.data)
        
    except Give.DoesNotExist:
        return Response(
            {'error': 'Give not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def gives_stats(request):
    """Get statistics about Gives."""
    user = request.user
    
    if user.is_superadmin:
        # Admin gets overall stats
        total_gives = Give.objects.count()
        active_gives = Give.objects.filter(is_active=True).count()
        category_stats = {}
        
        for category, _ in Give.CATEGORY_CHOICES:
            category_stats[category] = Give.objects.filter(
                category=category, is_active=True
            ).count()
        
        return Response({
            'total_gives': total_gives,
            'active_gives': active_gives,
            'category_stats': category_stats
        })
    else:
        # Regular user gets their own stats
        user_gives = Give.objects.filter(user=user)
        total_gives = user_gives.count()
        active_gives = user_gives.filter(is_active=True).count()
        category_stats = {}
        
        for category, _ in Give.CATEGORY_CHOICES:
            category_stats[category] = user_gives.filter(
                category=category, is_active=True
            ).count()
        
        return Response({
            'total_gives': total_gives,
            'active_gives': active_gives,
            'category_stats': category_stats
        })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_give_status(request, give_id):
    """Toggle the active status of a Give."""
    try:
        give = Give.objects.get(id=give_id)
        
        # Only allow if user is the creator or super admin
        if give.user != request.user and not request.user.is_superadmin:
            return Response(
                {'error': 'You can only modify your own Gives'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        give.is_active = not give.is_active
        give.save()
        
        serializer = GiveSerializer(give)
        return Response(serializer.data)
        
    except Give.DoesNotExist:
        return Response(
            {'error': 'Give not found'},
            status=status.HTTP_404_NOT_FOUND
        ) 