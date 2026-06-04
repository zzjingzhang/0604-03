from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'status', 'is_staff', 'created_at')
    list_filter = ('role', 'status', 'is_staff')
    search_fields = ('username', 'email')
    fieldsets = UserAdmin.fieldsets + (
        ('自定义信息', {'fields': ('role', 'phone', 'avatar', 'status')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('自定义信息', {'fields': ('role', 'phone', 'avatar', 'status')}),
    )
