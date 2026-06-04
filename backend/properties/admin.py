from django.contrib import admin
from .models import Property, Favorite, RentalApplication


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title', 'landlord', 'district', 'price', 'house_type', 'area', 'status', 'created_at')
    list_filter = ('district', 'house_type', 'status')
    search_fields = ('title', 'address')


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'property', 'created_at')
    list_filter = ('created_at',)


@admin.register(RentalApplication)
class RentalApplicationAdmin(admin.ModelAdmin):
    list_display = ('tenant', 'property', 'status', 'created_at')
    list_filter = ('status', 'created_at')
