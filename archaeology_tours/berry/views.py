from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse
from .models import Annotations, Additional, bImages, Question, Artifact
from django.template import loader
from django.contrib.auth.decorators import login_required

import json

# Create your views here.
def index(request):
   template = loader.get_template('index.html')
   pages = Additional.objects.all()
   images = bImages.objects.filter(siteName="The Berry Site")
   imageUrls = [image.image.url for image in images]
   questions = Question.objects.filter(siteName="The Berry Site").prefetch_related('answers')
   artifacts = Artifact.objects.filter(siteName="The Berry Site")
   context = {"pages": pages, "images": images, "imageUrls": imageUrls, "questions": questions,
              "artifacts": artifacts}
   return HttpResponse(template.render(context, request)) 


def get_annotations(request):
    annotations = Annotations.objects.all()
    response_data = []
    for ann in annotations:
        popup_url = ann.popupImage.url if ann.popupImage else None
        popup_text = ann.popupText if ann.popupText else None
        response_data.append({
            'x': ann.x,
            'y': ann.y,
            'text': ann.text,
            'imageNo': ann.imageNo,
            'siteName': ann.siteName,
            'popupImage': popup_url,
            'popupText': popup_text,
        })
    return JsonResponse(response_data, safe=False)

def save_annotation(request):
   if request.method == 'POST':
      data = json.loads(request.body)
      annotation = Annotations(x=data['x'], y=data['y'],
             text=data['txt'], imageNo=data['imageNo'],
             siteName=data['siteName'], user=request.user)
      annotation.save()
      return JsonResponse({'status': 'success'})
   return JsonResponse({'status': 'failed'}, status=400)

def get_page(request, slug):
    page = get_object_or_404(Additional, slug=slug)
    pages = Additional.objects.all()
    county = page.county if page.county else "Burke"
    images = bImages.objects.filter(siteName=page.title)
    imageUrls = [image.image.url for image in images.all()]
    questions = Question.objects.filter(siteName=page.title).prefetch_related('answers')
    artifacts = Artifact.objects.filter(siteName=page.title)
    return render(request, "additionalPage.html", {'page': page, 'pages': pages, "county": county,
                     "images": images, "imageUrls": imageUrls, "questions": questions, "artifacts": artifacts}) 