from django.urls import path
from . import views

app_name = 'berry'

urlpatterns = [
    path("", views.index, name="index"),
    path("annotations/", views.get_annotations, name="get_annotations"),
    path("save_annotation/", views.save_annotation, name="save_annotation"),
    path('berry/<slug:slug>/', views.get_page, name='get_page'),
    path('stamps/', views.get_stamps, name='get_stamps'),
    path('collect_stamp/', views.collect_stamp, name='collect_stamp')
]
