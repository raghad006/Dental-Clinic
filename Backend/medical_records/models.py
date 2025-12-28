from django.db import models
from api.models import Appointment
from api.models import ClinicUser
from api.models import ClinicPatient
class Examination(models.Model):
    appointment = models.OneToOneField(
        Appointment,
        on_delete=models.CASCADE,
        related_name="examination"
    )
    patient = models.ForeignKey(
        ClinicPatient,
        on_delete=models.CASCADE,
        related_name="examinations"
    )
    doctor = models.ForeignKey(
        ClinicUser,
        on_delete=models.SET_NULL,
        null=True,
        related_name="examinations"
    )

    notes = models.TextField(blank=True, null=True)
    diagnosis = models.TextField(blank=True, null=True)
    treatment_plan = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Examination #{self.id} – {self.patient}"
class ToothExamination(models.Model):
    examination = models.ForeignKey(
        Examination,
        on_delete=models.CASCADE,
        related_name="teeth"
    )

    tooth_number = models.PositiveSmallIntegerField()  # 1–32

    pocket_depth = models.JSONField(default=list)
    bleeding = models.JSONField(default=list)
    mobility = models.PositiveSmallIntegerField(default=0)

    status = models.CharField(max_length=50)
    selected_surfaces = models.JSONField(blank=True, null=True)

    clinical_note = models.TextField(blank=True, null=True)
    soap_notes = models.JSONField(blank=True, null=True)

    procedure_history = models.JSONField(default=list)
    timeline_history = models.JSONField(default=list)
    removal_history = models.JSONField(default=list)

    tooth_shade = models.CharField(max_length=10, blank=True, null=True)
    last_cleaned = models.DateField(blank=True, null=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("examination", "tooth_number")

    def __str__(self):
        return f"Tooth {self.tooth_number} – Exam {self.examination_id}"
class Prescription(models.Model):
    examination = models.OneToOneField(
        'Examination',
        related_name='prescription',
        null=True,
        on_delete=models.CASCADE
    )
    appointment = models.ForeignKey(
        'api.Appointment',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='medical_prescriptions'
    )
    patient = models.ForeignKey(
        ClinicPatient, 
        on_delete=models.CASCADE, 
        related_name="medical_prescriptions"   # <-- change this
    )
    doctor = models.ForeignKey(
        ClinicUser, 
        on_delete=models.SET_NULL, 
        null=True,
        related_name="medical_prescriptions"  # <-- change this
    )
    created_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Prescription – Exam {self.examination_id}"
class PrescriptionItem(models.Model):
    prescription = models.ForeignKey(
        Prescription,
        on_delete=models.CASCADE,
        related_name="items"
    )
    medicine = models.CharField(max_length=255)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    notes = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.medicine
class PrescriptionHistory(models.Model):
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, related_name='audit_history')   
    changed_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)
    previous_data = models.JSONField() # Stores a snapshot of what it looked like before