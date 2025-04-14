
from django.shortcuts import render
from berry.models import Additional

def homepage(request):
    pages = Additional.objects.all()
    return render(request, "home.html", {'pages': pages})
