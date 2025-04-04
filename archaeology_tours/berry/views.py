from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse
from .models import Annotations, Additional
from django.template import loader
import json

# Create your views here.
def index(request):
   template = loader.get_template('index.html')
   pages = Additional.objects.all()
   context = {"pages": pages}
   return HttpResponse(template.render(context, request)) 

def get_annotations(request):
   annotations = Annotations.objects.all().values('x', 'y', 'text', 'imageNo')
   return JsonResponse(list(annotations), safe=False)

def save_annotation(request):
   if request.method == 'POST':
      data = json.loads(request.body)
      annotation = Annotations(x=data['x'], y=data['y'], text=data['txt'], imageNo=data['imageNo'])
      annotation.save()
      return JsonResponse({'status': 'success'})
   return JsonResponse({'status': 'failed'}, status=400)

def get_page(request, slug):
    page = get_object_or_404(Additional, slug=slug)
    pages = Additional.objects.all()
    return render(request, "additionalPage.html", {'page': page, 'pages': pages})