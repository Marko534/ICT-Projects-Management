from rest_framework import serializers
from .models import Flashcard


class FlashcardSerializer(serializers.ModelSerializer):
    document_title = serializers.ReadOnlyField(source='document.title')

    class Meta:
        model = Flashcard
        fields = ['id', 'document', 'document_title', 'question', 'answer', 'difficulty']
        read_only_fields = ['id', 'document_title']
