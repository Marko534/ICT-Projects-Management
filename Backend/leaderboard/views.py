from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Leaderboard
from .serializers import LeaderboardSerializer
from .utils import recalculate_ranks


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def leaderboard_list(request):
    """Get the current leaderboard"""
    leaderboard = Leaderboard.objects.all().order_by('rank')
    serializer = LeaderboardSerializer(leaderboard, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_leaderboard(request):
    """Export the leaderboard as CSV"""
    import csv
    from django.http import HttpResponse
    from io import StringIO
    from django.utils import timezone

    # Get leaderboard data
    leaderboard = Leaderboard.objects.all().order_by('rank')

    # Create CSV response
    response = HttpResponse(content_type='text/csv')
    timestamp = timezone.now().strftime("%Y%m%d_%H%M%S")
    response['Content-Disposition'] = f'attachment; filename="leaderboard_{timestamp}.csv"'

    # Write CSV data
    writer = csv.writer(response)
    writer.writerow(['Rank', 'Username', 'Score'])

    for entry in leaderboard:
        writer.writerow([entry.rank, entry.student.username, entry.total_score])

    return response