# Generated by Django 5.1.7 on 2025-04-14 12:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('berry', '0006_bimages_sitename'),
    ]

    operations = [
        migrations.AddField(
            model_name='annotations',
            name='siteName',
            field=models.CharField(default='The Berry Site', max_length=255),
        ),
    ]
