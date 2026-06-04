from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q
from .models import Property, Favorite, RentalApplication
from .serializers import (
    PropertySerializer, PropertyListSerializer, 
    FavoriteSerializer, RentalApplicationSerializer
)


class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [permissions.IsAuthenticated()]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PropertyListSerializer
        return PropertySerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        district = self.request.query_params.get('district')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        house_type = self.request.query_params.get('house_type')
        min_area = self.request.query_params.get('min_area')
        max_area = self.request.query_params.get('max_area')
        
        if self.request.user.is_authenticated:
            if self.request.user.role == 'landlord':
                queryset = queryset.filter(landlord=self.request.user)
            elif self.request.user.role == 'tenant':
                queryset = queryset.filter(status='approved')
            elif self.request.user.role == 'admin':
                status_filter = self.request.query_params.get('status')
                if status_filter:
                    queryset = queryset.filter(status=status_filter)
                pass
        else:
            queryset = queryset.filter(status='approved')
        
        if district:
            queryset = queryset.filter(district=district)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        if house_type:
            queryset = queryset.filter(house_type=house_type)
        if min_area:
            queryset = queryset.filter(area__gte=min_area)
        if max_area:
            queryset = queryset.filter(area__lte=max_area)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        if request.user.role != 'admin':
            return Response({'error': '无权限'}, status=status.HTTP_403_FORBIDDEN)
        properties = Property.objects.filter(status='pending')
        serializer = PropertyListSerializer(properties, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        if request.user.role != 'admin':
            return Response({'error': '无权限'}, status=status.HTTP_403_FORBIDDEN)
        property = self.get_object()
        property.status = 'approved'
        property.save()
        return Response({'status': '已通过'})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        if request.user.role != 'admin':
            return Response({'error': '无权限'}, status=status.HTTP_403_FORBIDDEN)
        property = self.get_object()
        property.status = 'rejected'
        property.save()
        return Response({'status': '已拒绝'})
    
    @action(detail=True, methods=['post'])
    def mark_rented(self, request, pk=None):
        property = self.get_object()
        if request.user.role != 'landlord' or property.landlord != request.user:
            return Response({'error': '无权限'}, status=status.HTTP_403_FORBIDDEN)
        property.status = 'rented'
        property.save()
        return Response({'status': '已标记为出租'})


class FavoriteViewSet(viewsets.ModelViewSet):
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer
    
    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['delete'])
    def remove(self, request):
        property_id = request.query_params.get('property_id')
        if property_id:
            Favorite.objects.filter(user=request.user, property_id=property_id).delete()
            return Response({'status': '已取消收藏'})
        return Response({'error': '缺少参数'}, status=status.HTTP_400_BAD_REQUEST)


class RentalApplicationViewSet(viewsets.ModelViewSet):
    queryset = RentalApplication.objects.all()
    serializer_class = RentalApplicationSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'tenant':
            return RentalApplication.objects.filter(tenant=user)
        elif user.role == 'landlord':
            return RentalApplication.objects.filter(property__landlord=user)
        elif user.role == 'admin':
            return RentalApplication.objects.all()
        return RentalApplication.objects.none()
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        application = self.get_object()
        if request.user.role == 'landlord' and application.property.landlord == request.user:
            application.status = 'approved'
            application.save()
            return Response({'status': '已通过'})
        return Response({'error': '无权限'}, status=status.HTTP_403_FORBIDDEN)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        application = self.get_object()
        if request.user.role == 'landlord' and application.property.landlord == request.user:
            application.status = 'rejected'
            application.save()
            return Response({'status': '已拒绝'})
        return Response({'error': '无权限'}, status=status.HTTP_403_FORBIDDEN)
