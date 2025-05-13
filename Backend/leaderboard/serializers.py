from rest_framework import serializers
from .models import Leaderboard


class LeaderboardSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.username')

    class Meta:
        model = Leaderboard
        fields = ['id', 'student', 'student_name', 'total_score', 'rank', 'last_updated']
        read_only_fields = ['id', 'student_name', 'last_updated']
