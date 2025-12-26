from rest_framework import serializers
from .models import StockItem, StockEntry
from datetime import date, timedelta
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
    quantity = serializers.SerializerMethodField()
    low_stock_threshold = serializers.SerializerMethodField()
    latest_stock_id = serializers.SerializerMethodField()
    expiry_date = serializers.SerializerMethodField()
    is_expiring_soon = serializers.SerializerMethodField()

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
            'expiry_date',
            'is_expiring_soon',
            'latest_stock_id'
        ]

    def get_latest_entry(self, obj):
        return StockEntry.objects.filter(item=obj).order_by('-created_at').first()

    def get_quantity(self, obj):
        entry = self.get_latest_entry(obj)
        return entry.quantity if entry else 0

    def get_low_stock_threshold(self, obj):
        entry = self.get_latest_entry(obj)
        return entry.low_stock_threshold if entry else None

    def get_latest_stock_id(self, obj):
        entry = self.get_latest_entry(obj)
        return entry.id if entry else None

    def get_expiry_date(self, obj):
        entry = self.get_latest_entry(obj)
        return entry.expiry_date if entry else None

    def get_is_expiring_soon(self, obj):
        entry = self.get_latest_entry(obj)
        if not entry or not entry.expiry_date:
            return False
        return entry.expiry_date <= date.today() + timedelta(days=30)
