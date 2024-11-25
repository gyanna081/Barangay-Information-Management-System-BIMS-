# Generated by Django 5.1.1 on 2024-10-13 16:03

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('brgy', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Complaint',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_filed', models.DateTimeField(auto_now_add=True)),
                ('incident_date', models.DateField()),
                ('complaint_details', models.TextField()),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('In Progress', 'In Progress'), ('Resolved', 'Resolved'), ('Closed', 'Closed')], max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Incident',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('incident_details', models.TextField()),
                ('status', models.CharField(choices=[('Open', 'Open'), ('Investigating', 'Investigating'), ('Resolved', 'Resolved'), ('Closed', 'Closed')], max_length=50)),
                ('complaint', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='incidents', to='brgy.complaint')),
            ],
        ),
    ]