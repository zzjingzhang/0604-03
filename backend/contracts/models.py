from django.db import models
from django.conf import settings
from properties.models import Property


class Contract(models.Model):
    STATUS_CHOICES = (
        ('active', '生效中'),
        ('expired', '已到期'),
        ('terminated', '已终止'),
    )
    
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='contracts')
    landlord = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='landlord_contracts')
    tenant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tenant_contracts')
    start_date = models.DateField()
    end_date = models.DateField()
    monthly_rent = models.DecimalField(max_digits=10, decimal_places=2)
    deposit = models.DecimalField(max_digits=10, decimal_places=2)
    terms = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'contracts'
        verbose_name = '合同'
        verbose_name_plural = '合同'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.property.title} - {self.tenant.username}"
