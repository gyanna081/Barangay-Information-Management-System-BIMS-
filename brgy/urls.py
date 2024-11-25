from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomUserViewSet, ResidentViewSet, HouseholdViewSet, ComplaintsViewSet, BarangayViewSet, ClearanceViewSet, PopulationViewSet, LoginAPIView

router = DefaultRouter()
router.register(r'users', CustomUserViewSet)
router.register(r'residents', ResidentViewSet)
router.register(r'households', HouseholdViewSet)
router.register(r'complaints', ComplaintsViewSet)
router.register(r'barangays', BarangayViewSet)   # New route for Barangay
router.register(r'clearances', ClearanceViewSet)  # New route for Clearance
router.register(r'populations', PopulationViewSet) 

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginAPIView, name='login'),
]
