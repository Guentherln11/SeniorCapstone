from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required

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

def profile(request):
    return render(request, "users/profile.html")