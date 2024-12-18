from django.contrib import admin
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

# Register your models here
admin.site.register(CustomUser)
admin.site.register(Resident)
admin.site.register(Household)
admin.site.register(Complaints)
admin.site.register(Barangay)
admin.site.register(Clearance)
admin.site.register(Population)
admin.site.register(Business)  # Register the Business model
