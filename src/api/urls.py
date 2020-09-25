from django.urls import path
from .views import views

urlpatterns = [
    path('', include('polls.urls')),

]