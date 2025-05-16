from django.db import models
from django.utils import timezone
from django.conf import settings


class Document(models.Model):
    title = models.CharField(max_length=255)
    file_path = models.FileField(upload_to='documents/')
    upload_date = models.DateTimeField(default=timezone.now)
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='documents')

    def __str__(self):
        return self.title