# Generated by Django 5.1.1 on 2024-10-14 05:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('brgy', '0012_alter_complaints_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='complaints',
            name='complaint_details',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='complaints',
            name='incident_details',
            field=models.CharField(max_length=255),
        ),
    ]