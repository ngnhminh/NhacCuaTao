from .views import PlaylistPostView, PlaylistGetView, PlaylistUpdateView, PlaylistDeleteView
from django.urls import path

urlpatterns = [
    path('PlaylistPostView/', PlaylistPostView.as_view(), name='PlaylistPostView'),
    path('PlaylistGetView/', PlaylistGetView.as_view(), name='PlaylistGetView'),
    path('PlaylistUpdateView/', PlaylistUpdateView.as_view(), name='PlaylistUpdateView'),
    path('PlaylistDeleteView/<str:id>/', PlaylistDeleteView.as_view(), name='PlaylistDeleteView'),
] 