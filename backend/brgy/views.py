from rest_framework import viewsets
from .models import CustomUser, Resident, Household, Complaints
from .serializers import CustomUserSerializer, ResidentSerializer, HouseholdSerializer, ComplaintsSerializer
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

# New ViewSet for Complaints
class ComplaintsViewSet(viewsets.ModelViewSet):
    queryset = Complaints.objects.all()
    serializer_class = ComplaintsSerializer

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
