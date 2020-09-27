from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Task(models.Model):
    title               = models.CharField(max_length=200, blank=True, null=True)
    order               = models.IntegerField(default=1)
    completed           = models.BooleanField(default=False, blank=True, null=True)
    duration            = models.IntegerField(blank=True, null=True, validators=[MinValueValidator(1800), MaxValueValidator(7200)])
    elapsed             = models.IntegerField(default=0)

    def __str__(self):
        return self.title
