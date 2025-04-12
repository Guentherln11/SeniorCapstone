from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.register, name="register"),
    path("login/", views.login_p, name="login"),
    path("profile/", views.profile, name="profile")
]
