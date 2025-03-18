from django.urls import path
from . import views

app_name = 'berry'

urlpatterns = [
    path("", views.index, name="index")
]
