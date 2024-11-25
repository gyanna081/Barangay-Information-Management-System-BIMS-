from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('User', 'User'),
        ('Brgy. Admin', 'Brgy. Admin'),
    )

    user_type = models.CharField(max_length=255, choices=ROLE_CHOICES, default='User')
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    username = models.CharField(max_length=255, unique=True)
    birth_date = models.DateField(null=True)
    gender = models.CharField(max_length=255, null=True)
    address = models.TextField(null=True)
    position = models.CharField(max_length=255, null=True)

    def __str__(self):
        return self.username

class Resident(models.Model):
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    birth_date = models.DateField(null=True)
    gender = models.CharField(max_length=255, null=True)
    address = models.TextField(null=True)
    civil_status = models.CharField(max_length=255, null=True)
    contact_number = models.CharField(max_length=255, null=True)

    def __str__(self):
        full_name = f"{self.first_name} {self.middle_name} {self.last_name}"
        return full_name

class Household(models.Model):
    household_number = models.CharField(max_length=255)
    household_head = models.CharField(max_length=255)
    number_of_members = models.IntegerField()

    def __str__(self):
        return self.household_number

class Complaints(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Ongoing', 'Ongoing'),
        ('Closed', 'Closed'),
    )

    date_filed = models.DateField(auto_now_add=True)
    incident_date = models.DateField()
    complaint_details = models.TextField(null=True)
    incident_details = models.TextField(null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending')

    def __str__(self):
        return f"Complaint filed on {self.date_filed} - Status: {self.get_status_display()}"

class Barangay(models.Model):
    barangay_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    address = models.TextField()
    population = models.IntegerField()

    def __str__(self):
        return self.name

class Clearance(models.Model):
    clearance_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    dob = models.DateField(db_column='date_of_birth')  # Match this to the key in your JS code
    gender = models.CharField(max_length=10)

    def __str__(self):
        return self.name
    

class Population(models.Model):
    barangay_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    population = models.IntegerField()

    def __str__(self):
        return self.name   