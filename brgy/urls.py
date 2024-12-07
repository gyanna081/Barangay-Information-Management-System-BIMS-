from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CustomUserViewSet,
    ResidentViewSet,
    HouseholdViewSet,
    ComplaintsViewSet,
    BarangayViewSet,
    ClearanceViewSet,
    PopulationViewSet,
    BusinessViewSet,  # Import the BusinessViewSet
    LoginAPIView
)

router = DefaultRouter()
router.register(r'users', CustomUserViewSet)
router.register(r'residents', ResidentViewSet)
router.register(r'households', HouseholdViewSet)
router.register(r'complaints', ComplaintsViewSet)
router.register(r'barangays', BarangayViewSet)  # Route for Barangay
router.register(r'clearances', ClearanceViewSet)  # Route for Clearance
router.register(r'populations', PopulationViewSet)
router.register(r'businesses', BusinessViewSet)  # Route for Business

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginAPIView, name='login'),
]
