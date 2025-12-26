from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PrescriptionViewSet, ExaminationRecordViewSet, ExaminationProgressViewSet

router = DefaultRouter()
router.register(r"prescriptions", PrescriptionViewSet, basename="prescriptions")
router.register(r"examinations", ExaminationRecordViewSet, basename="examinations")
router.register(r"examination-progress", ExaminationProgressViewSet, basename="examination-progress")

urlpatterns = [
    path("", include(router.urls)),
]
