from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.contrib.auth.hashers import make_password

# ---------------- Custom User ----------------
class ClinicUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('doctor', 'Doctor'),
        ('nurse', 'Nurse'),
    )

    username = None  # remove username
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='nurse')
    registration_code = models.CharField(max_length=50, blank=True, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    # Fix reverse accessor conflicts
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
    medical_history = models.TextField(blank=True, null=True)
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

    patient = models.ForeignKey(
        ClinicPatient, on_delete=models.CASCADE, related_name="appointments"
    )
    doctor = models.ForeignKey(
        "ClinicUser",  # string reference avoids circular import
        on_delete=models.SET_NULL,
        null=True,
        limit_choices_to={"role": "doctor"}
    )
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Awaiting")
    notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ["date", "time"]

    def __str__(self):
        return f"{self.patient.name} - {self.date} {self.time} ({self.status})"
