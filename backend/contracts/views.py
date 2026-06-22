from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated
from .models import Contract
from .serializers import ContractSerializer


class IsLandlord(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'landlord'


class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsLandlord()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'tenant':
            return Contract.objects.filter(tenant=user)
        elif user.role == 'landlord':
            return Contract.objects.filter(landlord=user)
        elif user.role == 'admin':
            return Contract.objects.all()
        return Contract.objects.none()
    
    def perform_create(self, serializer):
        serializer.save(landlord=self.request.user)
