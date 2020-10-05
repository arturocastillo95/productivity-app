from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import TaskSerializer
from .models import Task

@api_view(['GET'])
def apiOverView(request):
    api_urls = {
        'List': '/task-list/',
        'Detail': '/task-detail/',
        'Create': '/task-delete/',
        'Update': '/task-update/',
        'Delete': '/task-delete/',
    }
    return Response(api_urls)

@api_view(['GET'])
def tasksList(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def tasksListActive(request):
    tasks = Task.objects.filter(completed=False)
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def tasksListCompleted(request):
    tasks = Task.objects.filter(completed=True)
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def tasksDetail(request, id):
    tasks = Task.objects.get(id=id)
    serializer = TaskSerializer(tasks, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def tasksCreate(request):
    serializer = TaskSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['POST'])
def tasksUpdate(request, id):
    task = Task.objects.get(id=id)
    serializer = TaskSerializer(instance=task, data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['DELETE'])
def tasksDelete(request, id):
    task = Task.objects.get(id=id)
    task.delete()

    return Response('Item deleted!')

