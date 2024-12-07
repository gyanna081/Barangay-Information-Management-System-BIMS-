from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.
def index(request):
    return render(request, 'frontend/index.html')

def login(request):
    return render(request, 'frontend/pages/login.html')

def register(request):
    return render(request, 'frontend/pages/register.html')

@login_required(login_url='/')
def residents(request):
    return render(request, 'frontend/pages/residents.html')

@login_required(login_url='/')
def households(request):
    return render(request, 'frontend/pages/households.html')

@login_required(login_url='/')
def personnel(request):
    return render(request, 'frontend/pages/personnel.html')

@login_required(login_url='/')
def complaints(request):
    return render(request, 'frontend/pages/complaints.html')

@login_required(login_url='/')
def barangays(request):
    return render(request, 'frontend/pages/barangay.html')

@login_required(login_url='/')
def clearances(request):
    return render(request, 'frontend/pages/clearances.html')

@login_required(login_url='/')
def populations(request):
    return render(request, 'frontend/pages/population.html')

@login_required(login_url='/')
def businesses(request):  # New business management view
    return render(request, 'frontend/pages/business.html')
