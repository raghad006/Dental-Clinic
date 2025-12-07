from rest_framework import serializers
from django.contrib.auth.hashers import check_password, make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
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


class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(write_only=True)
    doctor_name = serializers.CharField(write_only=True)  

    patient = serializers.PrimaryKeyRelatedField(read_only=True)
    doctor = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Appointment
        fields = [
            "id",
            "patient",
            "doctor",
            "patient_name",
            "doctor_name",
            "date",
            "time",
            "status",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def validate(self, data):
        try:
            patient = ClinicPatient.objects.get(name=data["patient_name"])
        except ClinicPatient.DoesNotExist:
            raise serializers.ValidationError({"patient_name": "Patient not found."})
        data["patient"] = patient

        try:
            doctor = ClinicUser.objects.get(first_name__icontains=data["doctor_name"], role="doctor")
        except ClinicUser.DoesNotExist:
            raise serializers.ValidationError({"doctor_name": "Doctor not found."})
        data["doctor"] = doctor

        return data

    def create(self, validated_data):
        validated_data.pop("patient_name", None)
        validated_data.pop("doctor_name", None)
        return super().create(validated_data)
    patient_name = serializers.CharField(source="patient.name", read_only=True)
    doctor_name = serializers.CharField(source="doctor.full_display_name", read_only=True)
    
    patient = serializers.PrimaryKeyRelatedField(
        queryset=ClinicPatient.objects.all(),
        write_only=True
    )
    doctor = serializers.PrimaryKeyRelatedField(
        queryset=ClinicUser.objects.filter(role='doctor'),
        write_only=True
    )

    class Meta:
        model = Appointment
        fields = [
            "id",
            "patient",
            "patient_name",
            "doctor",
            "doctor_name",
            "date",
            "time",
            "status",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at", "patient_name", "doctor_name"]

    def create(self, validated_data):
        patient = validated_data.pop('patient')
        doctor = validated_data.pop('doctor')
        
        appointment = Appointment.objects.create(
            patient=patient,
            doctor=doctor,
            **validated_data
        )
        return appointment

class DoctorSerializer(serializers.ModelSerializer):
    full_display_name = serializers.CharField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)

    class Meta:
        model = ClinicUser
        fields = ['id', 'full_display_name', 'email', 'role', 'first_name', 'last_name']