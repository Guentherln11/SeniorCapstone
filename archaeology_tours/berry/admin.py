from django.contrib import admin
from .models import Annotations, bImages
from mysite.models import Videos

# Register your models here.
admin.site.register(Annotations)
admin.site.register(bImages)
admin.site.register(Videos)