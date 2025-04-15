
from django.shortcuts import render
from berry.models import Additional
from .models import Videos

def homepage(request):
    pages = Additional.objects.all()
    return render(request, "home.html", {'pages': pages})


def videos(request):
    context = {}
    videos = Videos.objects.all()
    context['videos'] = videos
    return render(request, 'videos.html', context)
