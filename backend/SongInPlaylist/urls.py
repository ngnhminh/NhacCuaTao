from .views import SongInPlaylistPostView
from django.urls import path

urlpatterns = [
    path('SongInPlaylistPostView/', SongInPlaylistPostView.as_view(), name='SongInPlaylistPostView'),
] 