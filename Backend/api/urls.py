from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ClinicUserRegisterView,
    PatientRegisterView,
    StaffTokenObtainPairView,
    PatientTokenObtainPairView,
    ClinicPatientListView,
    ClinicPatientCreateView,
    ClinicPatientRetrieveUpdateView,
    DoctorListView,
    AppointmentViewSet,
    get_available_time_slots,  # Add this import
    check_time_slot_availability,  # Add this import
    get_doctor_availability,  # Add this import
)

# ---------------- Router for appointments ----------------
router = DefaultRouter()
router.register(r"appointments", AppointmentViewSet, basename="appointments")

urlpatterns = [
    # ---------------- Staff Registration & Login ----------------
    path("register/staff/", ClinicUserRegisterView.as_view(), name="register-staff"),
    path("login/staff/", StaffTokenObtainPairView.as_view(), name="login-staff"),

    # ---------------- Patient Registration & Login ----------------
    path("register/patient/", PatientRegisterView.as_view(), name="register-patient"),
    path("login/patient/", PatientTokenObtainPairView.as_view(), name="login-patient"),

    # ---------------- Clinic Patients ----------------
    path("clinic-patients/", ClinicPatientListView.as_view(), name="clinic-patient-list"),
    path("clinic-patient/add/", ClinicPatientCreateView.as_view(), name="clinic-patient-add"),
    path(
        "clinic-patient/<str:patient_id>/",
        ClinicPatientRetrieveUpdateView.as_view(),
        name="clinic-patient-detail",
    ),

    path("staff/", DoctorListView.as_view(), name="doctor-list"),

    # ---------------- Time Slot Endpoints ----------------
    path("time-slots/available/", get_available_time_slots, name="time-slots-available"),
    path("time-slots/check/", check_time_slot_availability, name="check-time-slot"),
    path("doctors/<int:doctor_id>/availability/", get_doctor_availability, name="doctor-availability"),

    path("", include(router.urls)),
]