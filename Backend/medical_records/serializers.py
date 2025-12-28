from rest_framework import serializers
from .models import Prescription, PrescriptionItem, Examination, ToothExamination

class PrescriptionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescriptionItem
        fields = ["id", "medicine", "dosage", "frequency", "notes"]

class PrescriptionSerializer(serializers.ModelSerializer):
    items = PrescriptionItemSerializer(many=True, read_only=True)

    class Meta:
        model = Prescription
        fields = ["id", "created_at", "items"]

class ExaminationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Examination
        fields = ["id", "notes", "diagnosis", "treatment_plan", "created_at"]

class ToothExaminationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ToothExamination
        fields = "__all__"
