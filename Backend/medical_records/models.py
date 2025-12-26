from django.db import models
from django.utils import timezone
from api.models import ClinicPatient, ClinicUser, Appointment  # adjust import path as needed

# ---------------- Prescription ----------------
class Prescription(models.Model):
    appointment = models.OneToOneField(
        Appointment,
        on_delete=models.CASCADE,
        related_name="prescription"
    )
    patient = models.ForeignKey(ClinicPatient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(ClinicUser, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Prescription for {self.patient.name} ({self.patient.patient_id})"

class PrescriptionItem(models.Model):
    prescription = models.ForeignKey(Prescription, related_name="items", on_delete=models.CASCADE)
    medicine = models.CharField(max_length=255)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    notes = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.medicine} - {self.dosage} ({self.frequency})"

# ---------------- Examination / Progress ----------------
class ExaminationRecord(models.Model):
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name="examination")
    patient = models.ForeignKey(ClinicPatient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(ClinicUser, on_delete=models.SET_NULL, null=True)
    notes = models.TextField(blank=True, null=True)
    diagnosis = models.TextField(blank=True, null=True)
    treatment_plan = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Examination for {self.patient.name} ({self.patient.patient_id})"

class ExaminationProgress(models.Model):
    examination = models.ForeignKey(ExaminationRecord, related_name="progress_entries", on_delete=models.CASCADE)
    session_number = models.PositiveIntegerField()
    description = models.TextField()
    before_images = models.JSONField(blank=True, null=True)  # URLs or paths to X-rays/photos
    after_images = models.JSONField(blank=True, null=True)   # URLs or paths to X-rays/photos
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Session {self.session_number} for {self.examination.patient.name}"

