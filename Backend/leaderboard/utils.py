from django.db.models import Sum, F, Count
from django.db import transaction


def update_leaderboard(user_id):
    """Update the leaderboard entry for a specific user"""
    from study.models import StudySession
    from .models import Leaderboard
    from django.contrib.auth import get_user_model

    User = get_user_model()
    user = User.objects.get(id=user_id)

    # Only update leaderboard for students
    if not user.is_student:
        return None

    # Calculate statistics from completed study sessions
    sessions = StudySession.objects.filter(
        student=user,
        end_time__isnull=False
    )

    stats = sessions.aggregate(
        total_score=Sum('score'),
        total_sessions=Count('id'),
        total_correct=Sum('correct_count'),
        total_cards=Sum('total_count')
    )

    # Update or create leaderboard entry
    leaderboard, created = Leaderboard.objects.update_or_create(
        student=user,
        defaults={
            'total_score': stats['total_score'] or 0,
            'total_sessions': stats['total_sessions'] or 0,
            'total_correct': stats['total_correct'] or 0,
            'total_cards': stats['total_cards'] or 0
        }
    )

    # Recalculate ranks
    recalculate_ranks()

    # Get updated entry
    return Leaderboard.objects.get(student=user)


def recalculate_ranks():
    """Recalculate the ranks for all users on the leaderboard"""
    from .models import Leaderboard

    with transaction.atomic():
        # Get all entries ordered by score (descending)
        leaderboard_entries = Leaderboard.objects.all().order_by('-total_score')

        # Update ranks
        for i, entry in enumerate(leaderboard_entries, 1):
            entry.rank = i

        # Bulk update
        if leaderboard_entries:
            Leaderboard.objects.bulk_update(leaderboard_entries, ['rank'])
