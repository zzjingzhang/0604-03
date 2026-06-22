from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q
from .models import Property, Favorite, RentalApplication
from .serializers import (
    PropertySerializer, PropertyListSerializer, 
    FavoriteSerializer, RentalApplicationSerializer
)


class IsLandlord(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'landlord'


class IsTenant(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'tenant'


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'mark_rented']:
            return [IsLandlord()]
        if self.action in ['pending', 'approve', 'reject']:
            return [IsAdmin()]
        return [IsAuthenticated()]
    
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
        status_filter = self.request.query_params.get('status')
        
        user = self.request.user
        if user.is_authenticated:
            if user.role == 'landlord':
                queryset = queryset.filter(landlord=user)
            elif user.role == 'tenant':
                queryset = queryset.filter(status='approved')
            elif user.role == 'admin':
                if status_filter:
                    queryset = queryset.filter(status=status_filter)
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
    
    def perform_create(self, serializer):
        serializer.save(landlord=self.request.user)
    
    def perform_update(self, serializer):
        instance = self.get_object()
        if instance.landlord != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('您只能编辑自己的房源')
        serializer.save()
    
    def perform_destroy(self, instance):
        if instance.landlord != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('您只能删除自己的房源')
        instance.delete()
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        properties = Property.objects.filter(status='pending')
        serializer = PropertyListSerializer(properties, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        property = self.get_object()
        property.status = 'approved'
        property.save()
        return Response({'status': '已通过'})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        property = self.get_object()
        property.status = 'rejected'
        property.save()
        return Response({'status': '已拒绝'})
    
    @action(detail=True, methods=['post'])
    def mark_rented(self, request, pk=None):
        property = self.get_object()
        if property.landlord != request.user:
            return Response({'error': '无权限'}, status=status.HTTP_403_FORBIDDEN)
        property.status = 'rented'
        property.save()
        return Response({'status': '已标记为出租'})


class FavoriteViewSet(viewsets.ModelViewSet):
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer
    permission_classes = [IsTenant]
    
    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
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
    
    def get_permissions(self):
        if self.action in ['create']:
            return [IsTenant()]
        if self.action in ['approve', 'reject']:
            return [IsLandlord()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'tenant':
            return RentalApplication.objects.filter(tenant=user)
        elif user.role == 'landlord':
            return RentalApplication.objects.filter(property__landlord=user)
        elif user.role == 'admin':
            return RentalApplication.objects.all()
        return RentalApplication.objects.none()
    
    def perform_create(self, serializer):
        property_id = self.request.data.get('property_id')
        property_obj = Property.objects.filter(id=property_id, status='approved').first()
        if not property_obj:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'property_id': '房源不存在或未通过审核'})
        serializer.save(tenant=self.request.user)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        application = self.get_object()
        if application.property.landlord != request.user:
            return Response({'error': '您只能审核自己房源的申请'}, status=status.HTTP_403_FORBIDDEN)
        application.status = 'approved'
        application.save()
        return Response({'status': '已通过'})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        application = self.get_object()
        if application.property.landlord != request.user:
            return Response({'error': '您只能审核自己房源的申请'}, status=status.HTTP_403_FORBIDDEN)
        application.status = 'rejected'
        application.save()
        return Response({'status': '已拒绝'})
