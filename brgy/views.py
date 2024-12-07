from rest_framework import viewsets
from .models import (
    CustomUser,
    Resident,
    Household,
    Complaints,
    Barangay,
    Clearance,
    Population,
    Business  # Import the Business model
)
from .serializers import (
    CustomUserSerializer,
    ResidentSerializer,
    HouseholdSerializer,
    ComplaintsSerializer,
    BarangaySerializer,
    ClearanceSerializer,
    PopulationSerializer,
    BusinessSerializer  # Import the Business serializer
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view

# ViewSet for CustomUser
class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

# ViewSet for Resident
class ResidentViewSet(viewsets.ModelViewSet):
    queryset = Resident.objects.all()
    serializer_class = ResidentSerializer

# ViewSet for Household
class HouseholdViewSet(viewsets.ModelViewSet):
    queryset = Household.objects.all()
    serializer_class = HouseholdSerializer

# ViewSet for Complaints
class ComplaintsViewSet(viewsets.ModelViewSet):
    queryset = Complaints.objects.all()
    serializer_class = ComplaintsSerializer

# ViewSet for Barangay
class BarangayViewSet(viewsets.ModelViewSet):
    queryset = Barangay.objects.all()
    serializer_class = BarangaySerializer

# ViewSet for Clearance
class ClearanceViewSet(viewsets.ModelViewSet):
    queryset = Clearance.objects.all()
    serializer_class = ClearanceSerializer

# ViewSet for Population
class PopulationViewSet(viewsets.ModelViewSet):
    queryset = Population.objects.all()
    serializer_class = PopulationSerializer

# ViewSet for Business
class BusinessViewSet(viewsets.ModelViewSet):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer

@api_view(['POST'])
def LoginAPIView(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)

        token, created = Token.objects.get_or_create(user=user)
        
        session_key = request.session.session_key
        response = Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'username': user.username,
            'sessionid': session_key,
        }, status=status.HTTP_200_OK)

        response.set_cookie('sessionid', session_key, httponly=True)

        return response
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
