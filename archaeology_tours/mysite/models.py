from django.db import models
 
class Videos(models.Model):
    url = models.URLField()
    title = models.CharField(max_length = 255)
    creator = models.CharField(max_length = 255)
    description = models.TextField()