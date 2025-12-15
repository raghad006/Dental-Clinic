from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from datetime import datetime, time

# ---------------- Custom User ----------------
class ClinicUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('doctor', 'Doctor'),
        ('nurse', 'Nurse'),
    )

    username = None  
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='nurse')
    registration_code = models.CharField(max_length=50, blank=True, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    groups = models.ManyToManyField(
        Group,
        related_name='clinicuser_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='clinicuser_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    @property
    def full_display_name(self):
        prefix = ''
        if self.role == 'doctor':
            prefix = 'Dr_'
        elif self.role == 'nurse':
            prefix = 'Nrs_'
        elif self.role == 'admin':
            prefix = 'Admn_'
        return f"{prefix}{self.first_name} {self.last_name}"

    def __str__(self):
        return f"{self.full_display_name} ({self.role})"

# ---------------- Patient (for registration) ----------------
class Patient(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    phone = models.CharField(max_length=20, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.password.startswith('pbkdf2_'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

# ---------------- Clinic Patient ----------------
class ClinicPatient(models.Model):
    patient_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=255)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    emergency_contact = models.CharField(max_length=255, blank=True, null=True)
    blood_type = models.CharField(max_length=5, blank=True, null=True)
    medical_history = models.JSONField(blank=True, null=True)  # Add this line
    allergies = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient_id} - {self.name}" 
# ---------------- Appointment ----------------
class Appointment(models.Model):
    STATUS_CHOICES = [
        ("Awaiting", "Awaiting"),
        ("Checked In", "Checked In"),
        ("Cancelled", "Cancelled"),
    ]
    
    PROCEDURE_CHOICES = [
        ("Teeth Cleaning", "Teeth Cleaning"),
        ("Filling", "Filling"),
        ("Implant", "Implant"),
        ("Consultation", "Consultation"),
        ("Root Canal Treatment", "Root Canal Treatment"),
        ("Checkup", "Checkup"),
        ("Veneers", "Veneers"),
        ("Ortho Consult", "Ortho Consult"),
        ("Braces Adj.", "Braces Adj."),
        ("Surgery", "Surgery"),
    ]

    patient = models.ForeignKey(
        ClinicPatient, on_delete=models.CASCADE, related_name="appointments"
    )
    doctor = models.ForeignKey(
        "ClinicUser",
        on_delete=models.SET_NULL,
        null=True,
        limit_choices_to={"role": "doctor"}
    )
    date = models.DateField()
    time = models.TimeField()
    procedure_type = models.CharField(
        max_length=50, 
        choices=PROCEDURE_CHOICES, 
        blank=True, 
        null=True
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Awaiting")
    notes = models.TextField(blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["date", "time"]
        # Add unique constraint to prevent double booking
        constraints = [
            models.UniqueConstraint(
                fields=['doctor', 'date', 'time'],
                name='unique_doctor_time_slot',
                condition=models.Q(status__in=["Awaiting", "Checked In"])
            )
        ]

    def __str__(self):
        return f"{self.patient.name} - {self.date} {self.time} ({self.status})"
    
    @classmethod
    def get_available_time_slots(cls, doctor_id, date):
        """Get available time slots for a specific doctor on a specific date"""
        # Get all booked slots for this doctor on this date
        booked_appointments = cls.objects.filter(
            doctor_id=doctor_id,
            date=date,
            status__in=["Awaiting", "Checked In"]
        )
        
        # Convert TimeField to string format "HH:MM"
        booked_times = [appt.time.strftime("%H:%M") for appt in booked_appointments]
        
        # Define all possible time slots
        all_time_slots = [
            "09:00", "09:30", "10:00", "10:30",
            "11:00", "11:30", "12:00", "12:30",
            "13:00", "13:30", "14:00", "14:30",
            "15:00", "15:30", "16:00", "16:30",
        ]
        
        # Filter out past times for today
        if date == timezone.now().date():
            current_time = timezone.now().time()
            # Convert current time to minutes for comparison
            current_minutes = current_time.hour * 60 + current_time.minute
            
            all_time_slots = [
                slot for slot in all_time_slots 
                if (int(slot.split(':')[0]) * 60 + int(slot.split(':')[1])) > current_minutes
            ]
        
        # Remove booked slots
        available_slots = [slot for slot in all_time_slots if slot not in booked_times]
        
        return available_slots
    
    @classmethod
    def is_time_slot_available(cls, doctor_id, date, time_str):
        """Check if a specific time slot is available"""
        # Convert time string to time object
        try:
            time_obj = datetime.strptime(time_str, "%H:%M").time()
        except ValueError:
            # Try with seconds format
            try:
                time_obj = datetime.strptime(time_str, "%H:%M:%S").time()
            except ValueError:
                return False
        
        return not cls.objects.filter(
            doctor_id=doctor_id,
            date=date,
            time=time_obj,
            status__in=["Awaiting", "Checked In"]
        ).exists()

# ---------------- Prescription ----------------
class Prescription(models.Model):
    appointment = models.OneToOneField(
        Appointment,
        on_delete=models.CASCADE,
        related_name="prescription"
    )
    patient = models.ForeignKey(
        ClinicPatient,
        on_delete=models.CASCADE
    )
    doctor = models.ForeignKey(
        ClinicUser,
        on_delete=models.SET_NULL,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Prescription for {self.patient.name} ({self.patient.patient_id})"

# ---------------- Prescription Item ----------------
class PrescriptionItem(models.Model):
    prescription = models.ForeignKey(
        Prescription,
        related_name="items",
        on_delete=models.CASCADE
    )
    medicine = models.CharField(max_length=255)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    notes = models.CharField(max_length=255, blank=True)
    
    def __str__(self):
        return f"{self.medicine} - {self.dosage} ({self.frequency})"