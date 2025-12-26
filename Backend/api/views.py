from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import GenericAPIView
from rest_framework.decorators import api_view, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from datetime import datetime as dt, datetime, timedelta, time as dt_time
from django.utils import timezone

from .serializers import (
    ClinicUserRegisterSerializer,
    PatientRegisterSerializer,
    StaffTokenObtainPairSerializer,
    PatientTokenObtainPairSerializer,
    ClinicPatientSerializer,
    AppointmentSerializer,
    DoctorSerializer,
    TimeSlotSerializer
)

from .models import ClinicUser, Patient, Appointment, ClinicPatient

# ================= STAFF & PATIENT VIEWS =================

class ClinicUserRegisterView(generics.CreateAPIView):
    queryset = ClinicUser.objects.all()
    serializer_class = ClinicUserRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({"message": "Staff registered successfully."}, status=status.HTTP_201_CREATED)


class PatientRegisterView(generics.CreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({"message": "Patient registered successfully."}, status=status.HTTP_201_CREATED)


class StaffTokenObtainPairView(TokenObtainPairView):
    serializer_class = StaffTokenObtainPairSerializer


class PatientTokenObtainPairView(GenericAPIView):
    serializer_class = PatientTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


# ================= CLINIC PATIENT VIEWS =================

class ClinicPatientCreateView(generics.CreateAPIView):
    queryset = ClinicPatient.objects.all()
    serializer_class = ClinicPatientSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({"message": "Clinic patient added successfully."}, status=status.HTTP_201_CREATED)


class ClinicPatientListView(generics.ListAPIView):
    queryset = ClinicPatient.objects.all()
    serializer_class = ClinicPatientSerializer


class ClinicPatientDetailView(generics.RetrieveAPIView):
    queryset = ClinicPatient.objects.all()
    serializer_class = ClinicPatientSerializer
    lookup_field = 'patient_id'


class ClinicPatientRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = ClinicPatient.objects.all()
    serializer_class = ClinicPatientSerializer
    lookup_field = 'patient_id'
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        partial = True
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ================= DOCTOR VIEWS =================

class DoctorListView(generics.ListAPIView):
    serializer_class = DoctorSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return ClinicUser.objects.filter(role='doctor')


# ================= APPOINTMENT HELPERS =================

def combine_date_time(date_field, time_value):
    """
    Combine a date and a time (either decimal or datetime.time) into a timezone-aware datetime.
    """
    if isinstance(time_value, (float, int)):
        hours = int(time_value)
        minutes = int((time_value - hours) * 60)
        t = dt_time(hour=hours, minute=minutes)
    elif isinstance(time_value, dt_time):
        t = time_value
    else:
        raise ValueError("Invalid time_value type. Must be float/int or datetime.time.")

    dt_obj = datetime.combine(date_field, t)
    return timezone.make_aware(dt_obj)



class AppointmentListCreateView(generics.ListCreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        patient_id = self.request.query_params.get("patient_id")
        status_filter = self.request.query_params.get("status")

        if patient_id:
            queryset = queryset.filter(patient__patient_id=patient_id)

        if status_filter == "upcoming":
            queryset = queryset.filter(date__gte=datetime.date.today())
        elif status_filter == "previous":
            queryset = queryset.filter(date__lt=datetime.date.today())

        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    queryset = Appointment.objects.all().order_by("date", "time")  # include all statuses

    # Optional: filter by status via query param
    def get_queryset(self):
        queryset = Appointment.objects.all().order_by("date", "time")
        status_param = self.request.query_params.get("status")
        if status_param:
            queryset = queryset.filter(status=status_param)
        return queryset

    @action(detail=False, methods=["get"])
    def available_time_slots(self, request):
        """Return available time slots for a doctor and date"""
        serializer = TimeSlotSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        doctor_id = serializer.validated_data["doctor_id"]
        date = serializer.validated_data["date"]

        available_slots = Appointment.get_available_time_slots(doctor_id, date)
        doctor = Appointment.objects.filter(doctor_id=doctor_id).first()
        doctor_name = doctor.doctor.full_display_name if doctor else "Doctor"

        return Response({
            "doctor_id": doctor_id,
            "doctor_name": doctor_name,
            "available_time_slots": available_slots
        })

    @action(detail=False, methods=["post"])
    def check_time_slot(self, request):
        """Check if a specific time slot is available"""
        serializer = TimeSlotSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        doctor_id = serializer.validated_data["doctor_id"]
        date = serializer.validated_data["date"]
        time_str = serializer.validated_data.get("time")

        is_available = True
        if time_str:
            is_available = Appointment.is_time_slot_available(doctor_id, date, time_str)

        doctor = Appointment.objects.filter(doctor_id=doctor_id).first()
        doctor_name = doctor.doctor.full_display_name if doctor else "Doctor"

        return Response({
            "doctor_id": doctor_id,
            "doctor_name": doctor_name,
            "time": time_str,
            "is_available": is_available
        })


# ================= TIME SLOT API ENDPOINTS =================

@api_view(['GET'])
def get_available_time_slots(request):
    doctor_id = request.query_params.get('doctor_id')
    date_str = request.query_params.get('date')

    if not doctor_id or not date_str:
        return Response({"error": "Both doctor_id and date are required"}, status=400)

    try:
        date = dt.strptime(date_str, "%Y-%m-%d").date()
        doctor = ClinicUser.objects.get(id=doctor_id, role="doctor")
    except ValueError:
        return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, status=400)
    except ClinicUser.DoesNotExist:
        return Response({"error": "Doctor not found"}, status=404)

    available_slots = Appointment.get_available_time_slots(doctor_id, date)

    return Response({
        "success": True,
        "doctor_id": doctor_id,
        "doctor_name": doctor.full_display_name,
        "date": date_str,
        "available_time_slots": available_slots,
        "total_available": len(available_slots),
    })


@api_view(['POST'])
def check_time_slot_availability(request):
    serializer = TimeSlotSerializer(data=request.data)
    if serializer.is_valid():
        doctor_id = serializer.validated_data['doctor_id']
        date = serializer.validated_data['date']
        time_str = serializer.validated_data.get('time')

        if time_str:
            is_available = Appointment.is_time_slot_available(doctor_id, date, time_str)
            return Response({
                "success": True,
                "doctor_id": doctor_id,
                "date": date,
                "time": time_str,
                "is_available": is_available,
            })
        else:
            available_slots = Appointment.get_available_time_slots(doctor_id, date)
            return Response({
                "success": True,
                "doctor_id": doctor_id,
                "date": date,
                "available_time_slots": available_slots,
                "total_available": len(available_slots),
            })

    return Response({"success": False, "errors": serializer.errors}, status=400)


@api_view(['GET'])
def get_doctor_availability(request, doctor_id):
    date_str = request.query_params.get('date')
    days = int(request.query_params.get('days', 7))

    try:
        doctor = ClinicUser.objects.get(id=doctor_id, role="doctor")
    except ClinicUser.DoesNotExist:
        return Response({"error": "Doctor not found"}, status=404)

    if date_str:
        try:
            start_date = dt.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, status=400)
    else:
        start_date = datetime.date.today()

    availability = []
    for i in range(days):
        current_date = start_date + timedelta(days=i)
        available_slots = Appointment.get_available_time_slots(doctor_id, current_date)
        availability.append({
            "date": current_date.strftime("%Y-%m-%d"),
            "day": current_date.strftime("%A"),
            "available_slots": available_slots,
            "total_available": len(available_slots),
        })

    return Response({
        "success": True,
        "doctor_id": doctor_id,
        "doctor_name": doctor.full_display_name,
        "start_date": start_date.strftime("%Y-%m-%d"),
        "days": days,
        "availability": availability,
    })
