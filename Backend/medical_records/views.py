from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from .models import Examination, Prescription
from .serializers import ExaminationSerializer, PrescriptionSerializer
from api.models import ClinicPatient
from api.serializers import PrescriptionNestedSerializer
class ClinicPatientMedicalRecordView(APIView):
    def get(self, request, patient_id):
        try:
            patient = ClinicPatient.objects.get(patient_id=patient_id)
        except ClinicPatient.DoesNotExist:
            return Response({"error": "Patient not found"}, status=404)

        exams = Examination.objects.filter(patient=patient).order_by("-created_at")
        prescriptions = Prescription.objects.filter(patient=patient).prefetch_related('items', 'audit_history').order_at("-created_at")

        exam_data = ExaminationSerializer(exams, many=True).data
        presc_data = []
        for p in prescriptions:
            p_dict = PrescriptionNestedSerializer(p).data
        
        # Add the history of this specific prescription to the response
            p_dict['history'] = [
            {
                "changed_at": h.changed_at,
                "previous_notes": h.notes,
                "previous_medicines": h.previous_data
            } for h in p.audit_history.all().order_by('-changed_at')
        ]
            presc_data.append(p_dict)

        return Response({
            "patient_id": patient.patient_id,
            "name": patient.name,
            "age": patient.age,
            "gender": patient.gender,
            "phone": patient.phone,
            "medical_history": patient.medical_history,
            "examinations": exam_data,
            "prescriptions": presc_data,
        })
class PrescriptionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionNestedSerializer
