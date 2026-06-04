from django.contrib import admin
from .models import Contract


@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ('property', 'landlord', 'tenant', 'start_date', 'end_date', 'monthly_rent', 'status')
    list_filter = ('status', 'start_date', 'end_date')
    search_fields = ('property__title', 'landlord__username', 'tenant__username')
