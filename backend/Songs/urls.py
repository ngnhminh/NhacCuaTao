from django.urls import path
from .views import SongGetView

urlpatterns = [
    path('SongGetView/', SongGetView.as_view(), name='SongGetView'),
]