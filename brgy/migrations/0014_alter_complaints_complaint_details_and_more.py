# Generated by Django 5.1.1 on 2024-10-14 05:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('brgy', '0013_alter_complaints_complaint_details_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='complaints',
            name='complaint_details',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='complaints',
            name='incident_details',
            field=models.TextField(null=True),
        ),
    ]
