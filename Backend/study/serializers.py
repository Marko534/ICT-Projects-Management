from rest_framework import serializers
from .models import StudySession
from flashcards.models import Flashcard


class StudySessionSerializer(serializers.ModelSerializer):
    student_username = serializers.ReadOnlyField(source='student.username')
    accuracy = serializers.SerializerMethodField()

    class Meta:
        model = StudySession
        fields = [
            'id', 'student', 'student_username', 'start_time', 'end_time',
            'score', 'correct_count', 'total_count', 'accuracy'
        ]
        read_only_fields = ['id', 'student', 'student_username', 'start_time']

    def get_accuracy(self, obj):
        if obj.total_count > 0:
            return round((obj.correct_count / obj.total_count) * 100, 2)
        return 0


class StartSessionSerializer(serializers.Serializer):
    flashcard_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=True
    )

    def validate_flashcard_ids(self, value):
        # Validate that all flashcard IDs exist
        existing_ids = set(Flashcard.objects.filter(id__in=value).values_list('id', flat=True))
        invalid_ids = set(value) - existing_ids

        if invalid_ids:
            raise serializers.ValidationError(f"Flashcards with IDs {invalid_ids} do not exist")

        return value


class AnswerSubmissionSerializer(serializers.Serializer):
    flashcard_id = serializers.IntegerField(required=True)
    is_correct = serializers.BooleanField(required=True)
    time_taken = serializers.FloatField(required=True, min_value=0)

    def validate_flashcard_id(self, value):
        try:
            Flashcard.objects.get(id=value)
            return value
        except Flashcard.DoesNotExist:
            raise serializers.ValidationError(f"Flashcard with ID {value} does not exist")
