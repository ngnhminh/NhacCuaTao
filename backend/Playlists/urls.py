from .views import PlaylistPostView, PlaylistGetView
from django.urls import path

urlpatterns = [
    path('PlaylistPostView/', PlaylistPostView.as_view(), name='PlaylistPostView'),
    path('PlaylistGetView/', PlaylistGetView.as_view(), name='PlaylistGetView'),
] 