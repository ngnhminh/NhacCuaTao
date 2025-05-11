from django.urls import path
from .views import AlbumPostView, AlbumGetView

urlpatterns = [
    path('AlbumPostView/', AlbumPostView.as_view(), name='AlbumPostView'),
    path('AlbumGetView/', AlbumGetView.as_view(), name='AlbumGetView'),
]