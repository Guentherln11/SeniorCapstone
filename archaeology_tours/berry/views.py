from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Annotations
from django.template import loader
import json

# Create your views here.
def index(request):
   template = loader.get_template('index.html')
   return HttpResponse(template.render()) 

def get_annotations(request):
   annotations = Annotations.objects.all().values('x', 'y', 'text')
   return JsonResponse(list(annotations), safe=False)

def save_annotation(request):
   if request.method == 'POST':
      data = json.loads(request.body)
      annotation = Annotations(x=data['x'], y=data['y'], text=data['txt'])
      annotation.save()
      return JsonResponse({'status': 'success'})
   return JsonResponse({'status': 'failed'}, status=400)