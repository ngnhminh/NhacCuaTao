from .views import FavoriteSongGetView, FavoriteSongPostView, FavoriteSongDeleteView
from django.urls import path

urlpatterns = [
    path('FavoriteSongGetView/', FavoriteSongGetView.as_view(), name='FavoriteSongGetView'),
    path('FavoriteSongPostView/', FavoriteSongPostView.as_view(), name='FavoriteSongPostView'),
    path('FavoriteSongDeleteView/<str:id>/', FavoriteSongDeleteView.as_view(), name='FavoriteSongDeleteView'),
] 