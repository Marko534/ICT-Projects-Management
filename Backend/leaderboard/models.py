from django.db import models
from django.conf import settings


class Leaderboard(models.Model):
    student = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='leaderboard')
    total_score = models.IntegerField(default=0)
    rank = models.IntegerField(null=True, blank=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Rank {self.rank}: {self.student.username}"

    class Meta:
        ordering = ['rank']