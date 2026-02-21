from django.urls import path
from . import views

urlpatterns = [
    path('employees/', views.employee_list_create, name='employee-list-create'),
    path('employees/<int:pk>/', views.employee_delete, name='employee-delete'),
    path('employees/<int:pk>/attendance/', views.employee_attendance, name='employee-attendance'),
    path('attendance/', views.attendance_list_create, name='attendance-list-create'),
]
