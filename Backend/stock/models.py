from django.db import models

class StockItem(models.Model):
    CATEGORY_CHOICES = [
        ("Medications", "Medications"),
        ("Supplies", "Supplies"),
        ("Equipment", "Equipment"),
        ("Vaccines", "Vaccines"),
        ("Lab Equipment", "Lab Equipment"),
        ("Consumables", "Consumables"),
        ("Personal Protective Equipment", "Personal Protective Equipment"),
    ]
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    unit = models.CharField(max_length=50)
    image = models.CharField(max_length=255, blank=True, null=True)
    has_expiry = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class StockEntry(models.Model):
    item = models.ForeignKey(StockItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)
    low_stock_threshold = models.PositiveIntegerField(default=10)
    expiry_date = models.DateField(null=True, blank=True)
    supplier = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.item.name} - {self.quantity} {self.item.unit}"

