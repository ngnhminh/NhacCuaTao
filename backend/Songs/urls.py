from django.urls import path
from .views import SongGetView, SongUpdateView

urlpatterns = [
    path('SongGetView/', SongGetView.as_view(), name='SongGetView'),
    path('SongUpdateView/', SongUpdateView.as_view(), name='SongUpdateView'),
]