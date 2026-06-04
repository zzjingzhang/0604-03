from rest_framework import serializers
from .models import Contract
from properties.serializers import PropertyListSerializer
from users.serializers import UserSerializer


class ContractSerializer(serializers.ModelSerializer):
    property = PropertyListSerializer(read_only=True)
    landlord = UserSerializer(read_only=True)
    tenant = UserSerializer(read_only=True)
    property_id = serializers.IntegerField(write_only=True)
    tenant_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Contract
        fields = '__all__'
        read_only_fields = ('landlord', 'status')
    
    def create(self, validated_data):
        validated_data['landlord'] = self.context['request'].user
        return super().create(validated_data)
