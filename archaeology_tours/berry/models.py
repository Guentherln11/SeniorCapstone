from django.db import models

# Create your models here.
class Annotations(models.Model):
    x = models.FloatField()
    y = models.FloatField()
    text = models.CharField(max_length=255)
    imageNo = models.IntegerField()
    siteName = models.CharField(max_length=255, default='The Berry Site')
    popupImage = models.ImageField(upload_to='annotation_images/', blank=True, null=True)
    popupText = models.TextField(blank=True, null=True)

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
    image = models.ImageField(upload_to='images/', blank=True, null=True)

    
class Question(models.Model):
    question = models.CharField(max_length=255)
    siteName = models.CharField(max_length=255)

    def __str__(self):
        return self.question

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    answer_text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.answer_text
    
class Artifact(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to="artifacts/")
    siteName = models.CharField(max_length=255, default='The Berry Site') 

    def __str__(self):
        return self.title
