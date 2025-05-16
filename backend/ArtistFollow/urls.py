from .views import ArtistFollowGetView, ArtistFollowDeleteView, ArtistFollowPostView
from django.urls import path

urlpatterns = [
    path('ArtistFollowGetView/', ArtistFollowGetView.as_view(), name='ArtistFollowGetView'),
    path('ArtistFollowDeleteView/<str:id>/', ArtistFollowDeleteView.as_view(), name='ArtistFollowDeleteView'),
    path('ArtistFollowPostView/', ArtistFollowPostView.as_view(), name='ArtistFollowPostView'),
]