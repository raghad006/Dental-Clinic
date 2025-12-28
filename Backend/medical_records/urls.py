from django.urls import path
from .views import ClinicPatientMedicalRecordView , PrescriptionDetailView

urlpatterns = [
    path('patient/<str:patient_id>/records/', ClinicPatientMedicalRecordView.as_view(), name='clinic-patient-medical-record'),
    path('clinic-patient/<str:patient_id>/prescriptions/<int:pk>/', PrescriptionDetailView.as_view(), name='prescription-detail'),]
