from .views import ArtistUpdateView, ArtistGetView
from django.urls import path

urlpatterns = [
    path('ArtistUpdateView/', ArtistUpdateView.as_view(), name='ArtistUpdateView'),
    path('ArtistGetView/', ArtistGetView.as_view(), name='ArtistGetView'),
]