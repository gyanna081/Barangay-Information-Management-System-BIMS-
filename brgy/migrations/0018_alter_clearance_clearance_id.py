# Generated by Django 5.1.1 on 2024-11-02 18:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('brgy', '0017_alter_clearance_date_of_birth_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clearance',
            name='clearance_id',
            field=models.CharField(max_length=50, primary_key=True, serialize=False),
        ),
    ]
