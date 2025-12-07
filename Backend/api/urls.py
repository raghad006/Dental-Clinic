from django.urls import path
from .views import (
    ClinicUserRegisterView,
    PatientRegisterView,
    StaffTokenObtainPairView,
    PatientTokenObtainPairView,
    ClinicPatientCreateView,
    ClinicPatientListView,
    AppointmentListCreateView,
    ClinicPatientDetailView,
    DoctorListView,  # <-- import the new view
)

urlpatterns = [
    # ---------------- Registration ----------------
    path('register/staff/', ClinicUserRegisterView.as_view(), name='register-staff'),
    path('register/patient/', PatientRegisterView.as_view(), name='register-patient'),

    # ---------------- Login ----------------
    path('login/staff/', StaffTokenObtainPairView.as_view(), name='login-staff'),
    path('login/patient/', PatientTokenObtainPairView.as_view(), name='login-patient'),

    # ---------------- Clinic Patients ----------------
    path("clinic-patients/", ClinicPatientListView.as_view(), name="clinic-patient-list"),
    path("clinic-patient/add/", ClinicPatientCreateView.as_view(), name="clinic-patient-add"),
    path("clinic-patient/<str:patient_id>/", ClinicPatientDetailView.as_view(), name="clinic-patient-detail"),

    # ---------------- Appointments ----------------
    path("appointments/", AppointmentListCreateView.as_view(), name="appointments-list-create"),

    # ---------------- Doctors ----------------
    path("staff/", DoctorListView.as_view(), name="doctor-list"),
]
