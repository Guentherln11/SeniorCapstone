from django.urls import path
from . import views

app_name = 'berry'

urlpatterns = [
    path("", views.index, name="index"),
    path("annotations/", views.get_annotations, name="get_annotations"),
    path("save_annotation/", views.save_annotation, name="save_annotation"),
]
