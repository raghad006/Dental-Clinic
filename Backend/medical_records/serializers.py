from rest_framework import serializers
from .models import Prescription, PrescriptionItem, ExaminationRecord, ExaminationProgress

# ---------------- Prescription Serializers ----------------
class PrescriptionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescriptionItem
        fields = ["id", "medicine", "dosage", "frequency", "notes"]

class PrescriptionSerializer(serializers.ModelSerializer):
    items = PrescriptionItemSerializer(many=True)

    class Meta:
        model = Prescription
        fields = ["id", "appointment", "patient", "doctor", "created_at", "items"]

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])
        prescription = Prescription.objects.create(**validated_data)
        for item in items_data:
            PrescriptionItem.objects.create(prescription=prescription, **item)
        return prescription

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", [])
        instance.save()
        instance.items.all().delete()
        for item in items_data:
            PrescriptionItem.objects.create(prescription=instance, **item)
        return instance

# ---------------- Examination Serializers ----------------
class ExaminationProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExaminationProgress
        fields = ["id", "session_number", "description", "before_images", "after_images", "created_at"]

class ExaminationRecordSerializer(serializers.ModelSerializer):
    progress_entries = ExaminationProgressSerializer(many=True, read_only=True)

    class Meta:
        model = ExaminationRecord
        fields = ["id", "appointment", "patient", "doctor", "notes", "diagnosis", "treatment_plan", "created_at", "updated_at", "progress_entries"]
