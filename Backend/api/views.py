from rest_framework import generics, status , viewsets, filters
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import GenericAPIView
from .serializers import (
    ClinicUserRegisterSerializer,
    PatientRegisterSerializer,
    StaffTokenObtainPairSerializer,
    PatientTokenObtainPairSerializer,
    ClinicPatientSerializer,
    AppointmentSerializer,
    DoctorSerializer,
)
from .models import ClinicUser, Patient ,Appointment , ClinicPatient 
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
import datetime
class ClinicUserRegisterView(generics.CreateAPIView):
    queryset = ClinicUser.objects.all()
    serializer_class = ClinicUserRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"message": "Staff registered successfully."},
            status=status.HTTP_201_CREATED
        )


# ---------------- Patient registration ----------------
class PatientRegisterView(generics.CreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"message": "Patient registered successfully."},
            status=status.HTTP_201_CREATED
        )


# ---------------- Staff login ----------------
class StaffTokenObtainPairView(TokenObtainPairView):
    serializer_class = StaffTokenObtainPairSerializer


# ---------------- Patient login ----------------
class PatientTokenObtainPairView(GenericAPIView):
    serializer_class = PatientTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)

# Create new clinic patient
class ClinicPatientCreateView(generics.CreateAPIView):
    queryset = ClinicPatient.objects.all()
    serializer_class = ClinicPatientSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"message": "Clinic patient added successfully."},
            status=status.HTTP_201_CREATED
        )

# Optional: List all clinic patients
class ClinicPatientListView(generics.ListAPIView):
    queryset = ClinicPatient.objects.all()
    serializer_class = ClinicPatientSerializer






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

class ClinicPatientDetailView(generics.RetrieveAPIView):
    queryset = ClinicPatient.objects.all()
    serializer_class = ClinicPatientSerializer
    lookup_field = 'patient_id'


class ClinicPatientRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = ClinicPatient.objects.all()
    serializer_class = ClinicPatientSerializer
    lookup_field = 'patient_id'

    def update(self, request, *args, **kwargs):
        partial = True  # allow PATCH partial updates
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DoctorListView(generics.ListAPIView):
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ClinicUser.objects.filter(role='doctor')
