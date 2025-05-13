from django.db import models
from documents.models import Document


class Flashcard(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]

    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='flashcards')
    question = models.TextField()
    answer = models.TextField()
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='medium')

    def __str__(self):
        return f"Flashcard {self.id}: {self.question[:30]}..."