# Generated by Django 5.1.1 on 2024-10-26 08:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('brgy', '0016_clearance'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clearance',
            name='date_of_birth',
            field=models.DateField(db_column='date_of_birth'),
        ),
        migrations.RenameField(
            model_name='clearance',
            old_name='date_of_birth',
            new_name='dob',
        ),
        migrations.RemoveField(
            model_name='clearance',
            name='issued_date',
        ),
    ]
