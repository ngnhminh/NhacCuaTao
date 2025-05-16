from django.urls import path
from .views import SongGetView, SongUpdateView, SongDeleteView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('SongGetView/', SongGetView.as_view(), name='SongGetView'),
    path('SongUpdateView/', SongUpdateView.as_view(), name='SongUpdateView'),
    path('SongDeleteView/<str:id>/', SongDeleteView.as_view(), name='SongDeleteView'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)