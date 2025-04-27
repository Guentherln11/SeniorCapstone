from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from .models import Profile, UserStamp

# Create your views here.
def register(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("/users/login/")
    else:
        form = UserCreationForm()
    return render(request, "users/register.html", { "form": form })

def login_p(request):
    if request.method=="POST":
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            login(request, form.get_user())
            return redirect("/users/profile/")

    else:
        form = AuthenticationForm()
    return render(request, "users/login.html", { "form": form })

@login_required
def profile(request):
    profile = Profile.objects.get(user=request.user)
    collected_stamps = UserStamp.objects.filter(profile=profile).select_related('stamp')
    return render(request, "users/profile.html", {'collected_stamps': collected_stamps})
