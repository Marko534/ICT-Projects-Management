from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('login/', obtain_auth_token, name='login'),
    path('login-custom/', views.login_view, name='login-custom'),
    path('profile/', views.user_profile, name='profile'),
    path('profile/update/', views.update_profile, name='update_profile'),
]
