from rest_framework import serializers
from .models import CustomUser, Resident, Household, Complaints
from django.contrib.auth.hashers import make_password

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super(CustomUserSerializer, self).create(validated_data)

class ResidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resident
        fields = '__all__'

class HouseholdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Household
        fields = '__all__'

# New Complaints serializer
class ComplaintsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaints
        fields = '__all__'
