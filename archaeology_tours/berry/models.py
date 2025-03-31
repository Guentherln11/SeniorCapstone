from django.db import models

# Create your models here.
class Annotations(models.Model):
    x = models.FloatField()
    y = models.FloatField()
    text = models.CharField(max_length=255)
    imageNo = models.IntegerField()

class bImages(models.Model):
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to='images/')