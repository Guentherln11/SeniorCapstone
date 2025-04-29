from django.contrib import admin
from .models import Annotations, bImages, Additional, Question, Answer, Stamp, Artifact
from mysite.models import Videos
from users.models import UserStamp
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

class UserStampInline(admin.TabularInline):
    model = UserStamp
    extra = 0
    readonly_fields = ('profile',)

class StampAdmin(admin.ModelAdmin):
    inlines = [UserStampInline]

admin.site.register(Stamp, StampAdmin)
admin.site.register(UserStamp)
