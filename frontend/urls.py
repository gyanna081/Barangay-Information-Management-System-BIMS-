from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

app_name = 'frontend'

urlpatterns = [
    path('', auth_views.LoginView.as_view(template_name='frontend/pages/login.html'), name='login'),
    path('register/', views.register, name='register'),
    path('residents/', views.residents, name='residents'),
    path('households/', views.households, name='households'),
    path('personnel/', views.personnel, name='personnel'),
    path('complaints/', views.complaints, name='complaints'),
    path('barangays/', views.barangays, name='barangays'),  # Add this line
    path('clearances/', views.clearances, name='clearances'),
    path('populations/', views.populations, name='populations'),
]
