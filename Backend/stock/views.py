from rest_framework import viewsets, status
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import StockItem, StockEntry
from .serializers import StockItemSerializer, StockEntrySerializer


class StockItemViewSet(viewsets.ModelViewSet):
    queryset = StockItem.objects.all()
    serializer_class = StockItemSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data

        # Create StockItem
        item = StockItem.objects.create(
            name=data['name'],
            category=data['category'],
            unit=data['unit'],
            image=data.get('image', None),
            has_expiry=data.get('has_expiry', False)
        )

        # Create initial StockEntry
        StockEntry.objects.create(
            item=item,
            quantity=int(data.get('quantity', 0)),
            low_stock_threshold=int(data.get('low_stock_threshold', 10)),
            expiry_date=data.get('expiry_date'),
            supplier=data.get('supplier', ''),
        )

        serializer = StockItemSerializer(item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        item = self.get_object()
        data = request.data

        # Update StockItem fields
        item.name = data.get('name', item.name)
        item.category = data.get('category', item.category)
        item.unit = data.get('unit', item.unit)
        item.image = data.get('image', item.image)
        item.has_expiry = data.get('has_expiry', item.has_expiry)
        item.save()

        # Update latest StockEntry
        entry = StockEntry.objects.filter(item=item).last()
        if entry:
            entry.quantity = data.get('quantity', entry.quantity)
            entry.low_stock_threshold = data.get('low_stock_threshold', entry.low_stock_threshold)
            entry.expiry_date = data.get('expiry_date', entry.expiry_date)
            entry.supplier = data.get('supplier', entry.supplier)
            entry.save()

        serializer = StockItemSerializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK)


class StockEntryViewSet(ModelViewSet):
    queryset = StockEntry.objects.all().order_by("-created_at")
    serializer_class = StockEntrySerializer
    permission_classes = [IsAuthenticated]
