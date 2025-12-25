from rest_framework import serializers
from .models import StockItem, StockEntry

class StockEntrySerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.name', read_only=True)
    item_unit = serializers.CharField(source='item.unit', read_only=True)
    item_image = serializers.CharField(source='item.image', read_only=True)

    class Meta:
        model = StockEntry
        fields = [
            'id',
            'item',
            'item_name',
            'item_unit',
            'item_image',
            'quantity',
            'low_stock_threshold',
            'expiry_date',
            'supplier',
            'price',
            'created_at'
        ]

class StockItemSerializer(serializers.ModelSerializer):
    # Include latest stock entry info
    quantity = serializers.SerializerMethodField()
    low_stock_threshold = serializers.SerializerMethodField()
    latest_stock_id = serializers.SerializerMethodField()

    class Meta:
        model = StockItem
        fields = [
            'id',
            'name',
            'category',
            'unit',
            'image',
            'has_expiry',
            'quantity',
            'low_stock_threshold',
            'latest_stock_id'
        ]

    def get_quantity(self, obj):
        entry = StockEntry.objects.filter(item=obj).last()
        return entry.quantity if entry else 0

    def get_low_stock_threshold(self, obj):
        entry = StockEntry.objects.filter(item=obj).last()
        return entry.low_stock_threshold if entry else None

    def get_latest_stock_id(self, obj):
        entry = StockEntry.objects.filter(item=obj).last()
        return entry.id if entry else None
