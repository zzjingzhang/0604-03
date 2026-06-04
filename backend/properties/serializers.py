from rest_framework import serializers
from .models import Property, Favorite, RentalApplication
from users.serializers import UserSerializer


class PropertySerializer(serializers.ModelSerializer):
    landlord = UserSerializer(read_only=True)
    is_favorited = serializers.SerializerMethodField()
    
    class Meta:
        model = Property
        fields = '__all__'
        read_only_fields = ('landlord', 'status')
    
    def get_is_favorited(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return Favorite.objects.filter(user=user, property=obj).exists()
        return False
    
    def create(self, validated_data):
        validated_data['landlord'] = self.context['request'].user
        return super().create(validated_data)


class PropertyListSerializer(serializers.ModelSerializer):
    landlord_name = serializers.CharField(source='landlord.username', read_only=True)
    is_favorited = serializers.SerializerMethodField()
    
    class Meta:
        model = Property
        fields = ('id', 'title', 'district', 'address', 'price', 'house_type', 'area', 
                  'image', 'status', 'landlord_name', 'is_favorited', 'created_at')
    
    def get_is_favorited(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return Favorite.objects.filter(user=user, property=obj).exists()
        return False


class FavoriteSerializer(serializers.ModelSerializer):
    property = PropertyListSerializer(read_only=True)
    property_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Favorite
        fields = ('id', 'property', 'property_id', 'created_at')
        read_only_fields = ('user',)
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class RentalApplicationSerializer(serializers.ModelSerializer):
    property = PropertyListSerializer(read_only=True)
    tenant = UserSerializer(read_only=True)
    property_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = RentalApplication
        fields = ('id', 'property', 'tenant', 'message', 'status', 'property_id', 'created_at')
        read_only_fields = ('tenant', 'status')
    
    def create(self, validated_data):
        validated_data['tenant'] = self.context['request'].user
        return super().create(validated_data)
