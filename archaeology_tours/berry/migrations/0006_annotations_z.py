# Generated by Django 5.1.6 on 2025-04-08 20:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('berry', '0005_additional_county'),
    ]

    operations = [
        migrations.AddField(
            model_name='annotations',
            name='z',
            field=models.FloatField(blank=True, default=0.0),
        ),
    ]
