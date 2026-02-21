from rest_framework import serializers
from .models import Employee, Attendance


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'employee_id', 'full_name', 'email', 'department', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_email(self, value):
        # DRF's EmailField already validates format; check uniqueness on create
        if self.instance is None:  # creating
            if Employee.objects.filter(email=value).exists():
                raise serializers.ValidationError("An employee with this email already exists.")
        return value

    def validate_employee_id(self, value):
        if self.instance is None:
            if Employee.objects.filter(employee_id=value).exists():
                raise serializers.ValidationError("An employee with this ID already exists.")
        return value


class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'employee', 'employee_name', 'date', 'status']
        read_only_fields = ['id']

    def validate(self, data):
        employee = data.get('employee')
        date = data.get('date')
        if employee and date:
            if Attendance.objects.filter(employee=employee, date=date).exists():
                raise serializers.ValidationError(
                    "Attendance for this employee on this date has already been marked."
                )
        return data
