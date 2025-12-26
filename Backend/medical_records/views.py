from rest_framework import viewsets
from .models import Prescription, ExaminationRecord, ExaminationProgress
from .serializers import PrescriptionSerializer, ExaminationRecordSerializer, ExaminationProgressSerializer

# ---------------- Prescription API ----------------
class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer

# ---------------- Examination API ----------------
class ExaminationRecordViewSet(viewsets.ModelViewSet):
    queryset = ExaminationRecord.objects.all()
    serializer_class = ExaminationRecordSerializer

class ExaminationProgressViewSet(viewsets.ModelViewSet):
    queryset = ExaminationProgress.objects.all()
    serializer_class = ExaminationProgressSerializer
