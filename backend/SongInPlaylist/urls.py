from .views import SongInPlaylistPostView, SongInPlaylistGetView, SongInPlaylistDeleteView
from django.urls import path

urlpatterns = [
    path('SongInPlaylistPostView/', SongInPlaylistPostView.as_view(), name='SongInPlaylistPostView'),
    path('SongInPlaylistGetView/', SongInPlaylistGetView.as_view(), name='SongInPlaylistGetView'),
    path('SongInPlaylistDeleteView/<str:songId>/<str:playlistId>/', SongInPlaylistDeleteView.as_view(), name='SongInPlaylistDeleteView'),
] 