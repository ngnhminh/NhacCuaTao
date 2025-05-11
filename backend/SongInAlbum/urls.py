from django.urls import path
from .views import SongInAlbumGetView

urlpatterns = [
    path('SongInAlbumGetView/', SongInAlbumGetView.as_view(), name='SongInAlbumGetView'),
]
