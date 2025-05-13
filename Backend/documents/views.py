from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Document
from .serializers import DocumentSerializer
from flashcards.services import generate_flashcards


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def document_list(request):
    """List all documents for the current user"""
    if request.user.is_teacher:
        # Teachers see their own documents
        documents = Document.objects.filter(teacher=request.user)
    else:
        # Students see all documents
        documents = Document.objects.all()

    serializer = DocumentSerializer(documents, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_document(request):
    """Upload a new document (teachers only)"""
    if not request.user.is_teacher:
        return Response({"error": "Only teachers can upload documents"},
                        status=status.HTTP_403_FORBIDDEN)

    serializer = DocumentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(teacher=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_document(request, document_id):
    """Generate flashcards from a document (teachers only)"""
    if not request.user.is_teacher:
        return Response({"error": "Only teachers can process documents"},
                        status=status.HTTP_403_FORBIDDEN)

    try:
        document = Document.objects.get(id=document_id, teacher=request.user)
    except Document.DoesNotExist:
        return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)

    num_cards = int(request.data.get('num_cards', 10))
    difficulty = request.data.get('difficulty', 'medium')

    flashcards = generate_flashcards(document_id, num_cards, difficulty)

    return Response({
        "success": True,
        "message": f"Generated {len(flashcards)} flashcards",
        "document_id": document_id
    })