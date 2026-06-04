from rest_framework import viewsets, permissions
from .models import Contract
from .serializers import ContractSerializer


class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'tenant':
            return Contract.objects.filter(tenant=user)
        elif user.role == 'landlord':
            return Contract.objects.filter(landlord=user)
        elif user.role == 'admin':
            return Contract.objects.all()
        return Contract.objects.none()
