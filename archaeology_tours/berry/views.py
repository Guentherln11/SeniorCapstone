from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse
from .models import Annotations, Additional, bImages
from django.template import loader
import json

# Create your views here.
def index(request):
   template = loader.get_template('index.html')
   pages = Additional.objects.all()
   images = bImages.objects.filter(siteName="The Berry Site")
   imageUrls = [image.image.url for image in images]
   context = {"pages": pages, "images": images, "imageUrls": imageUrls}
   return HttpResponse(template.render(context, request)) 


def get_annotations(request):
   annotations = Annotations.objects.all().values('x', 'y', 'text', 'imageNo', 'siteName')
   return JsonResponse(list(annotations), safe=False)

def save_annotation(request):
   if request.method == 'POST':
      data = json.loads(request.body)
      annotation = Annotations(x=data['x'], y=data['y'], text=data['txt'], imageNo=data['imageNo'], siteName=data['siteName'])
      annotation.save()
      return JsonResponse({'status': 'success'})
   return JsonResponse({'status': 'failed'}, status=400)

def get_page(request, slug):
    page = get_object_or_404(Additional, slug=slug)
    pages = Additional.objects.all()
    county = page.county if page.county else "Burke"
    images = bImages.objects.filter(siteName=page.title)
    imageUrls = [image.image.url for image in images]
    return render(request, "additionalPage.html", {'page': page, 'pages': pages, "county": county, "images": images, "imageUrls": imageUrls}) 