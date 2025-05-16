from django.urls import path
from . import views

urlpatterns = [
    path('', views.flashcard_list, name='flashcard_list'),
    path('document/<int:document_id>/', views.document_flashcards, name='document_flashcards'),
]
