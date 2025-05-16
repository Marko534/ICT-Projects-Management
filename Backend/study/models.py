from django.db import models
from django.utils import timezone
from django.conf import settings


class StudySession(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='study_sessions')
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(null=True, blank=True)
    score = models.IntegerField(default=0)
    correct_count = models.IntegerField(default=0)
    total_count = models.IntegerField(default=0)

    def __str__(self):
        return f"Session {self.id} by {self.student.username}"

    @property
    def accuracy(self):
        if self.total_count > 0:
            return (self.correct_count / self.total_count) * 100
        return 0