from django.urls import path
from . import views

urlpatterns = [
    path('start/', views.start_session, name='start_session'),
    path('<int:session_id>/answer/', views.record_answer, name='record_answer'),
    path('<int:session_id>/end/', views.end_session, name='end_session'),
    path('<int:session_id>/', views.get_session, name='get_session'),
    path('history/', views.session_history, name='session_history'),
]