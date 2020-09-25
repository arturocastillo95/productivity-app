from django.shortcuts import render
from django.http import JsonResponse

def apiOverView(request):
    return JsonResponse("API BASE", safe=False)
