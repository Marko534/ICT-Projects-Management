from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Sum, Avg, Count
from django.shortcuts import get_object_or_404

from .models import StudySession
from .serializers import StudySessionSerializer, StartSessionSerializer, AnswerSubmissionSerializer
from flashcards.models import Flashcard
from leaderboard.models import Leaderboard
from leaderboard.utils import update_leaderboard


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def session_history(request):
    """Get the study session history for the current user"""
    if not request.user.is_student:
        return Response(
            {"error": "Only students can view study sessions"},
            status=status.HTTP_403_FORBIDDEN
        )

    sessions = StudySession.objects.filter(student=request.user).order_by('-start_time')

    # Allow filtering by date ranges
    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')

    if start_date:
        sessions = sessions.filter(start_time__gte=start_date)
    if end_date:
        sessions = sessions.filter(start_time__lte=end_date)

    serializer = StudySessionSerializer(sessions, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_session(request):
    """Start a new study session"""
    if not request.user.is_student:
        return Response(
            {"error": "Only students can start study sessions"},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = StartSessionSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Create a new study session
    session = StudySession.objects.create(
        student=request.user,
        start_time=timezone.now(),
        total_count=len(serializer.validated_data['flashcard_ids'])
    )

    # Get the flashcards for this session
    flashcards = Flashcard.objects.filter(id__in=serializer.validated_data['flashcard_ids'])

    return Response({
        "session_id": session.id,
        "start_time": session.start_time,
        "total_cards": session.total_count,
        "flashcards": [
            {"id": card.id, "question": card.question, "difficulty": card.difficulty}
            for card in flashcards
        ]
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def record_answer(request, session_id):
    """Record an answer during a study session"""
    session = get_object_or_404(StudySession, id=session_id, student=request.user)

    if session.end_time:
        return Response(
            {"error": "Cannot record answers for a completed session"},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = AnswerSubmissionSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    flashcard_id = serializer.validated_data['flashcard_id']
    is_correct = serializer.validated_data['is_correct']
    time_taken = serializer.validated_data['time_taken']

    # Update session data
    if is_correct:
        session.correct_count += 1
        # Calculate score (correct answers + time bonus)
        time_bonus = max(10, int(100 - time_taken * 5))  # 0-20 seconds scale
        session.score += 100 + time_bonus

    session.save()

    return Response({
        "session_id": session.id,
        "correct_count": session.correct_count,
        "total_count": session.total_count,
        "current_score": session.score,
        "is_correct": is_correct,
        "accuracy": round((session.correct_count / session.total_count) * 100, 2) if session.total_count else 0
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def end_session(request, session_id):
    """End a study session and update leaderboard"""
    session = get_object_or_404(StudySession, id=session_id, student=request.user)

    if session.end_time:
        return Response(
            {"error": "Session is already completed"},
            status=status.HTTP_400_BAD_REQUEST
        )

    session.end_time = timezone.now()
    session.save()

    # Update leaderboard
    update_leaderboard(request.user.id)

    # Get updated leaderboard position
    try:
        leaderboard = Leaderboard.objects.get(student=request.user)
        rank = leaderboard.rank
    except Leaderboard.DoesNotExist:
        rank = None

    return Response({
        "session_id": session.id,
        "start_time": session.start_time,
        "end_time": session.end_time,
        "duration_seconds": (session.end_time - session.start_time).total_seconds(),
        "score": session.score,
        "correct_count": session.correct_count,
        "total_count": session.total_count,
        "accuracy": round((session.correct_count / session.total_count) * 100, 2) if session.total_count else 0,
        "leaderboard_rank": rank
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_session(request, session_id):
    """Get details of a specific study session"""
    session = get_object_or_404(StudySession, id=session_id, student=request.user)
    serializer = StudySessionSerializer(session)
    return Response(serializer.data)