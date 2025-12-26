from rest_framework import serializers
from django.contrib.auth.hashers import check_password, make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import datetime
from .models import ClinicUser, Patient, ClinicPatient, Appointment


class ClinicUserRegisterSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()

    class Meta:
        model = ClinicUser
        fields = ['first_name', 'last_name', 'email', 'password', 'role', 'registration_code']

    def validate(self, data):
        role = data.get('role')
        code = data.get('registration_code')
        if role in ['admin', 'doctor', 'nurse']:
            if code != 'Clinic2026':
                raise serializers.ValidationError("Invalid registration code for staff.")
        return data

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        role = validated_data.get('role')
        if role == 'admin':
            validated_data['is_staff'] = True
            validated_data['is_superuser'] = True
        else:
            validated_data['is_staff'] = True
            validated_data['is_superuser'] = False
        return super().create(validated_data)


class PatientRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['name', 'email', 'password', 'phone', 'date_of_birth', 'address']


class PatientTokenObtainPairSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)
    name = serializers.CharField(read_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        try:
            patient = Patient.objects.get(email=email)
        except Patient.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password.")

        if not check_password(password, patient.password):
            raise serializers.ValidationError("Invalid email or password.")

        refresh = RefreshToken.for_user(patient)
        access = refresh.access_token

        return {
            "refresh": str(refresh),
            "access": str(access),
            "name": patient.name,
            "email": patient.email,
        }


class StaffTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        data = super().validate(attrs)
        data['first_name'] = self.user.first_name
        data['last_name'] = self.user.last_name
        data['role'] = self.user.role
        return data


class ClinicPatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClinicPatient
        fields = ['patient_id', 'name', 'age', 'gender', 'phone', 'medical_history', 'allergies', 'created_at']
        read_only_fields = ['created_at']
    
    def update(self, instance, validated_data):
        allowed_fields = ['name', 'age', 'gender', 'phone']
        update_data = {
            k: v for k, v in validated_data.items() if k in allowed_fields
        }
        for key, value in update_data.items():
            setattr(instance, key, value)
        
        instance.save()
        return instance


class AppointmentSerializer(serializers.ModelSerializer):
    patient_identifier = serializers.CharField(
        write_only=True,
        required=True  # Changed from required=False to True
    )
    doctor_id = serializers.IntegerField(
        write_only=True,
        required=True  # Changed from required=False to True
    )
    phone_number = serializers.CharField(required=False, allow_blank=True)
    procedure_type = serializers.CharField(required=False, allow_blank=True)
    
    # Add these fields for frontend use
    available_time_slots = serializers.SerializerMethodField(read_only=True)
    is_time_available = serializers.SerializerMethodField(read_only=True)

    patient = serializers.PrimaryKeyRelatedField(read_only=True)
    doctor = serializers.PrimaryKeyRelatedField(read_only=True)
    patient_display = serializers.CharField(source="patient.name", read_only=True)
    doctor_display = serializers.CharField(source="doctor.full_display_name", read_only=True)

    class Meta:
        model = Appointment
        fields = [
            "id",
            "patient",
            "patient_display",
            "doctor",
            "doctor_display",
            "patient_identifier",
            "doctor_id",
            "date",
            "time",
            "procedure_type",
            "status",
            "notes",
            "phone_number",
            "available_time_slots",  # Add this
            "is_time_available",     # Add this
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "patient",
            "doctor",
            "patient_display",
            "doctor_display",
            "available_time_slots",
            "is_time_available",
            "created_at",
            "updated_at",
        ]
    
    def get_available_time_slots(self, obj):
        """Get available time slots for the appointment's doctor and date"""
        if hasattr(obj, 'doctor_id') and hasattr(obj, 'date'):
            return Appointment.get_available_time_slots(obj.doctor_id, obj.date)
        return []
    
    def get_is_time_available(self, obj):
        """Check if the appointment's time slot is available"""
        if hasattr(obj, 'doctor_id') and hasattr(obj, 'date') and hasattr(obj, 'time'):
            time_str = obj.time.strftime("%H:%M")
            return Appointment.is_time_slot_available(obj.doctor_id, obj.date, time_str)
        return True

    def validate(self, data):
        if self.instance is None:  # Only for creation
            # Validate patient_identifier
            pid = data.get("patient_identifier")
            if not pid:
                raise serializers.ValidationError({
                    "patient_identifier": "This field is required."
                })

            try:
                patient = ClinicPatient.objects.get(patient_id=pid)
            except ClinicPatient.DoesNotExist:
                raise serializers.ValidationError({
                    "patient_identifier": "Clinic patient not found."
                })

            # Validate doctor_id
            doc_pk = data.get("doctor_id")
            if not doc_pk:
                raise serializers.ValidationError({
                    "doctor_id": "This field is required."
                })

            try:
                doctor = ClinicUser.objects.get(pk=doc_pk, role="doctor")
            except ClinicUser.DoesNotExist:
                raise serializers.ValidationError({
                    "doctor_id": "Doctor not found."
                })

            # Check for time slot availability
            date = data.get("date")
            time_value = data.get("time")
            if date and time_value:
                # Convert time to string format for checking
                if isinstance(time_value, str):
                    time_str = time_value
                else:
                    time_str = time_value.strftime("%H:%M")
                
                # Check if time slot is available using the model method
                if not Appointment.is_time_slot_available(doc_pk, date, time_str):
                    raise serializers.ValidationError({
                        "time": f"This time slot ({time_str}) is already booked for Dr. {doctor.full_display_name} on {date}. Please choose another time."
                    })
                
                # Check if time is in the past for today
                if date == timezone.now().date():
                    try:
                        appointment_time = datetime.strptime(time_str, "%H:%M").time()
                        if appointment_time < timezone.now().time():
                            raise serializers.ValidationError({
                                "time": "Cannot book appointments in the past. Please choose a future time."
                            })
                    except ValueError:
                        # Try with seconds format
                        try:
                            appointment_time = datetime.strptime(time_str, "%H:%M:%S").time()
                            if appointment_time < timezone.now().time():
                                raise serializers.ValidationError({
                                    "time": "Cannot book appointments in the past. Please choose a future time."
                                })
                        except ValueError:
                            raise serializers.ValidationError({
                                "time": "Invalid time format. Use HH:MM or HH:MM:SS"
                            })

            # Add patient and doctor to validated data
            data["patient"] = patient
            data["doctor"] = doctor

        return data

    def create(self, validated_data):
        validated_data.pop("patient_identifier", None)
        validated_data.pop("doctor_id", None)
        
        # Set default status if not provided
        if "status" not in validated_data:
            validated_data["status"] = "Awaiting"
        
        return Appointment.objects.create(**validated_data)

    def update(self, instance, validated_data):
        allowed_fields = {"status", "notes", "procedure_type", "phone_number"}
        validated_data = {
            k: v for k, v in validated_data.items() if k in allowed_fields
        }
        return super().update(instance, validated_data)


class TimeSlotSerializer(serializers.Serializer):
    """Serializer for time slot availability checks"""
    doctor_id = serializers.IntegerField(required=True)
    date = serializers.DateField(required=True)
    time = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, data):
        doctor_id = data.get('doctor_id')
        date = data.get('date')
        time_str = data.get('time')
        
        # Validate doctor exists
        try:
            doctor = ClinicUser.objects.get(id=doctor_id, role="doctor")
        except ClinicUser.DoesNotExist:
            raise serializers.ValidationError({
                "doctor_id": "Doctor not found."
            })
        
        # If time is provided, check specific slot availability
        if time_str:
            is_available = Appointment.is_time_slot_available(doctor_id, date, time_str)
            data['is_available'] = is_available
            data['doctor_name'] = doctor.full_display_name
        
        return data


class DoctorSerializer(serializers.ModelSerializer):
    full_display_name = serializers.CharField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)

    class Meta:
        model = ClinicUser
        fields = ['id', 'full_display_name', 'email', 'role', 'first_name', 'last_name']

# api/serializers.py
from rest_framework import serializers
from .models import ClinicPatient
from medical_records.models import Prescription, PrescriptionItem, ExaminationRecord, ExaminationProgress

class PrescriptionItemNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescriptionItem
        fields = ["id", "medicine", "dosage", "frequency", "notes"]

class PrescriptionNestedSerializer(serializers.ModelSerializer):
    items = PrescriptionItemNestedSerializer(many=True, read_only=True)
    doctor_name = serializers.CharField(source="doctor.full_display_name", read_only=True)

    class Meta:
        model = Prescription
        fields = ["id", "doctor_name", "created_at", "items"]

class ExaminationProgressNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExaminationProgress
        fields = ["id", "session_number", "description", "before_images", "after_images", "created_at"]

class ExaminationRecordNestedSerializer(serializers.ModelSerializer):
    progress_entries = ExaminationProgressNestedSerializer(many=True, read_only=True)
    doctor_name = serializers.CharField(source="doctor.full_display_name", read_only=True)

    class Meta:
        model = ExaminationRecord
        fields = ["id", "doctor_name", "notes", "diagnosis", "treatment_plan", "created_at", "updated_at", "progress_entries"]

class ClinicPatientMedicalRecordSerializer(serializers.ModelSerializer):
    # Nested medical info
    prescriptions = serializers.SerializerMethodField()
    examinations = serializers.SerializerMethodField()
    xRays = serializers.SerializerMethodField()  # Placeholder
    treatmentPlans = serializers.SerializerMethodField()  # Placeholder
    last_visit = serializers.SerializerMethodField()

    class Meta:
        model = ClinicPatient
        fields = [
            "patient_id",
            "name",
            "age",
            "gender",
            "phone",
            "email",
            "address",
            "emergency_contact",
            "blood_type",
            "allergies",
            "medical_history",
            "examinations",
            "xRays",
            "treatmentPlans",
            "prescriptions",
            "last_visit",
        ]

    # ---------------- Prescriptions ----------------
    def get_prescriptions(self, obj):
        prescriptions = Prescription.objects.filter(patient=obj).prefetch_related("items")
        return PrescriptionNestedSerializer(prescriptions, many=True).data

    # ---------------- Examinations ----------------
    def get_examinations(self, obj):
        exams = ExaminationRecord.objects.filter(patient=obj).prefetch_related("progress_entries")
        return ExaminationRecordNestedSerializer(exams, many=True).data

    # ---------------- X-Rays placeholder ----------------
    def get_xRays(self, obj):
        return []

    # ---------------- Treatment Plans placeholder ----------------
    def get_treatmentPlans(self, obj):
        return []

    # ---------------- Last visit ----------------
    def get_last_visit(self, obj):
        last_appointment = obj.appointments.order_by("-date").first()
        if last_appointment:
            return last_appointment.date
        return None

    # ---------------- Deserialize medical_history ----------------
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        import json
        try:
            medical_history = json.loads(ret.get("medical_history") or "{}")
        except json.JSONDecodeError:
            medical_history = {}

        ret["medicalHistoryText"] = ", ".join(f"{k}: {v}" for k, v in medical_history.items()) if medical_history else "No medical history provided"
        ret["dentalHistory"] = medical_history.get("dental", "No dental history provided")
        return ret
