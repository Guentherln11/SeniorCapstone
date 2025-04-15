from django.db import models

# Create your models here.
class Annotations(models.Model):
    x = models.FloatField()
    y = models.FloatField()
    text = models.CharField(max_length=255)
    imageNo = models.IntegerField()
    siteName = models.CharField(max_length=255, default='The Berry Site')

class bImages(models.Model):
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to='images/')
    siteName = models.CharField(max_length=255, default='The Berry Site') 

class Additional(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    county = models.CharField(max_length = 255, blank=True)
    

