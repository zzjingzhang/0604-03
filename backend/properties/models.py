from django.db import models
from django.conf import settings


class Property(models.Model):
    STATUS_CHOICES = (
        ('pending', '待审核'),
        ('approved', '已通过'),
        ('rejected', '已拒绝'),
        ('rented', '已出租'),
    )
    
    DISTRICT_CHOICES = (
        ('chaoyang', '朝阳区'),
        ('haidian', '海淀区'),
        ('xicheng', '西城区'),
        ('dongcheng', '东城区'),
        ('fengtai', '丰台区'),
        ('shijingshan', '石景山区'),
        ('tongzhou', '通州区'),
        ('changping', '昌平区'),
        ('daxing', '大兴区'),
        ('yizhuang', '亦庄'),
    )
    
    HOUSE_TYPE_CHOICES = (
        ('1', '一室'),
        ('2', '两室'),
        ('3', '三室'),
        ('4', '四室及以上'),
    )
    
    landlord = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='properties')
    title = models.CharField(max_length=200)
    description = models.TextField()
    district = models.CharField(max_length=50, choices=DISTRICT_CHOICES)
    address = models.CharField(max_length=300)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    house_type = models.CharField(max_length=10, choices=HOUSE_TYPE_CHOICES)
    area = models.DecimalField(max_digits=10, decimal_places=2)
    floor = models.CharField(max_length=50, blank=True)
    orientation = models.CharField(max_length=50, blank=True)
    decoration = models.CharField(max_length=100, blank=True)
    facilities = models.TextField(blank=True)
    image = models.ImageField(upload_to='properties/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'properties'
        verbose_name = '房源'
        verbose_name_plural = '房源'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='favorites')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'favorites'
        verbose_name = '收藏'
        verbose_name_plural = '收藏'
        unique_together = ('user', 'property')
    
    def __str__(self):
        return f"{self.user.username} - {self.property.title}"


class RentalApplication(models.Model):
    STATUS_CHOICES = (
        ('pending', '待处理'),
        ('approved', '已通过'),
        ('rejected', '已拒绝'),
    )
    
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='applications')
    tenant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications')
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'rental_applications'
        verbose_name = '租赁申请'
        verbose_name_plural = '租赁申请'
    
    def __str__(self):
        return f"{self.tenant.username} - {self.property.title}"
