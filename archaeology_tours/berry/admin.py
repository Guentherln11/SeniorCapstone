from django.contrib import admin
from .models import Annotations, bImages, Additional, Question, Answer, Artifact
from mysite.models import Videos

# Register your models here.
admin.site.register(Annotations)
admin.site.register(bImages)
admin.site.register(Additional)
admin.site.register(Videos)
admin.site.register(Artifact)

class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 4

class QuestionAdmin(admin.ModelAdmin):
    inlines = [AnswerInline]

admin.site.register(Question, QuestionAdmin)