from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from EduCards import views

urlpatterns = [
                  path('admin/', admin.site.urls),
                  path('api/accounts/', include('accounts.urls')),
                  path('api/documents/', include('documents.urls')),
                  path('api/flashcards/', include('flashcards.urls')),
                  path('api/study/', include('study.urls')),
                  path('api/leaderboard/', include('leaderboard.urls')),

                  # Homepage for Drin
                  path('', views.home, name='home'),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
