from django.db import models
from django.contrib.auth.models import User
from berry.models import Stamp
from django.db.models.signals import post_save
from django.dispatch import receiver


# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE)

    def __str__(self):
        return self.user.username


class UserStamp(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    stamp = models.ForeignKey(Stamp, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('profile', 'stamp')

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

