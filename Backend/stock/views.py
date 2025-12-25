from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import StockItem
from .serializers import StockItemSerializer

class StockItemViewSet(ModelViewSet):
    queryset = StockItem.objects.all().order_by("-created_at")
    serializer_class = StockItemSerializer
    permission_classes = [IsAuthenticated]
