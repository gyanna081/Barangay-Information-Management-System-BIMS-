# Generated by Django 5.1.1 on 2024-11-02 19:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('brgy', '0018_alter_clearance_clearance_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clearance',
            name='clearance_id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]