from django.urls import path
from .views import apiOverView, tasksList, tasksDetail, tasksCreate, tasksUpdate, tasksDelete, tasksListActive, tasksListCompleted

urlpatterns = [
    path('', apiOverView, name='api_overview'),
    path('task-list/', tasksList, name='task_list'),
    path('task-list/active/', tasksListActive, name='task_list_active'),
    path('task-list/completed/', tasksListCompleted, name='task_list_completed'),
    path('task-detail/<str:id>/', tasksDetail, name='task-detail'),
    path('task-create/', tasksCreate, name='task-create'),
    path('task-update/<str:id>/', tasksUpdate, name='task-update'),
    path('task-delete/<str:id>/', tasksDelete, name='task-delete'),

]