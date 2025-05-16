from rest_framework import serializers
from .models import Document


class DocumentSerializer(serializers.ModelSerializer):
    teacher_name = serializers.ReadOnlyField(source='teacher.username')

    class Meta:
        model = Document
        fields = ['id', 'title', 'file_path', 'upload_date', 'teacher', 'teacher_name']
        read_only_fields = ['id', 'upload_date', 'teacher_name']
