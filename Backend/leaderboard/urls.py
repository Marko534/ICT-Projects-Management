from django.urls import path
from . import views

urlpatterns = [
    path('', views.leaderboard_list, name='leaderboard_list'),
    path('export/', views.export_leaderboard, name='export_leaderboard'),
]
