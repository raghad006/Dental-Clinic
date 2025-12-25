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
    quantity = models.PositiveIntegerField(default=0)
    low_stock_threshold = models.PositiveIntegerField(default=10)
    expiry_date = models.DateField(null=True, blank=True)
    supplier = models.CharField(max_length=255, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    unit = models.CharField(max_length=50, blank=True)

    image = models.ImageField(upload_to="stock_images/", null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
