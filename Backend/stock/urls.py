from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StockItemViewSet, StockEntryViewSet

router = DefaultRouter()
router.register(r"stock-items", StockItemViewSet, basename="stock-items")  
router.register(r"stock-entries", StockEntryViewSet, basename="stock-entries") 

urlpatterns = [
    path("", include(router.urls)),
]
