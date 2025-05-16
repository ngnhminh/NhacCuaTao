from django.urls import path
from .views import LoginView, RegisterView, LogoutView, OrtherActionView, UserDeleteView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('OrtherActionView/', OrtherActionView.as_view(), name='OrtherActionView'),
    path('UserDeleteView/<str:id>/', UserDeleteView.as_view(), name='UserDeleteView'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)