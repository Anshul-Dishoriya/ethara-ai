from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Employee, Attendance
from .serializers import EmployeeSerializer, AttendanceSerializer


# ── Employee endpoints ──────────────────────────────────────────────

@api_view(['GET', 'POST'])
def employee_list_create(request):
    """List all employees or create a new one."""
    if request.method == 'GET':
        employees = Employee.objects.all()
        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data)

    # POST
    serializer = EmployeeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def employee_delete(request, pk):
    """Delete an employee by primary key."""
    employee = get_object_or_404(Employee, pk=pk)
    employee.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# ── Attendance endpoints ────────────────────────────────────────────

@api_view(['GET', 'POST'])
def attendance_list_create(request):
    """List all attendance records (optionally filtered by date) or mark new attendance."""
    if request.method == 'GET':
        records = Attendance.objects.select_related('employee').all()
        date_filter = request.query_params.get('date')
        if date_filter:
            records = records.filter(date=date_filter)
        serializer = AttendanceSerializer(records, many=True)
        return Response(serializer.data)

    # POST
    serializer = AttendanceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def employee_attendance(request, pk):
    """Get attendance records for a specific employee."""
    employee = get_object_or_404(Employee, pk=pk)
    records = employee.attendance_records.all()
    serializer = AttendanceSerializer(records, many=True)
    return Response(serializer.data)
