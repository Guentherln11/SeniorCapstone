
from django.shortcuts import render
from .models import Videos


def homepage(request):
    return render(request, 'home.html')

def videos(request):
    context = {}
    videos = Videos.objects.all()
    context['videos'] = videos
    return render(request, 'videos.html', context)

