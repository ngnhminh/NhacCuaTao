from .views import SongInPlaylistPostView, SongInPlaylistGetView
from django.urls import path

urlpatterns = [
    path('SongInPlaylistPostView/', SongInPlaylistPostView.as_view(), name='SongInPlaylistPostView'),
    path('SongInPlaylistGetView/', SongInPlaylistGetView.as_view(), name='SongInPlaylistGetView'),
] 