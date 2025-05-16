from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Flashcard
from .serializers import FlashcardSerializer
from documents.models import Document


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def flashcard_list(request):
    """List all flashcards by document"""
    document_id = request.query_params.get('document_id')

    if document_id:
        flashcards = Flashcard.objects.filter(document_id=document_id)
    else:
        flashcards = Flashcard.objects.all()

    serializer = FlashcardSerializer(flashcards, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def document_flashcards(request, document_id):
    """Get all flashcards for a specific document"""
    try:
        document = Document.objects.get(id=document_id)
    except Document.DoesNotExist:
        return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)

    flashcards = Flashcard.objects.filter(document=document)
    serializer = FlashcardSerializer(flashcards, many=True)
    return Response(serializer.data)