from django.contrib import admin
from .models import CustomUser, Resident, Household, Complaints


admin.site.register(CustomUser)
admin.site.register(Resident)
admin.site.register(Household)
admin.site.register(Complaints)
