from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet, FavoriteViewSet, RentalApplicationViewSet

router = DefaultRouter()
router.register('', PropertyViewSet, basename='properties')
router.register('favorites', FavoriteViewSet, basename='favorites')
router.register('applications', RentalApplicationViewSet, basename='applications')

urlpatterns = [
    path('', include(router.urls)),
]
